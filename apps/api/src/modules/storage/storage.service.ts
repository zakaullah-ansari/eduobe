import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;

  constructor(private configService: ConfigService) {
    this.bucket = this.configService.get<string>('storage.bucket') || 'eduobe-files-dev';

    this.s3Client = new S3Client({
      region: this.configService.get<string>('storage.region') || 'auto',
      endpoint: this.configService.get<string>('storage.endpoint'),
      credentials: {
        accessKeyId: this.configService.get<string>('storage.accessKey') || '',
        secretAccessKey: this.configService.get<string>('storage.secretKey') || '',
      },
    });
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    contentType: string,
    folder?: string,
  ): Promise<{ key: string; url: string }> {
    const key = folder ? `${folder}/${uuidv4()}-${fileName}` : `${uuidv4()}-${fileName}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: contentType,
      }),
    );

    const publicUrl = this.configService.get<string>('storage.publicUrl');
    const url = publicUrl ? `${publicUrl}/${key}` : await this.getPresignedUrl(key);

    return { key, url };
  }

  async getPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async fileExists(key: string): Promise<boolean> {
    try {
      await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
      return true;
    } catch {
      return false;
    }
  }
}
