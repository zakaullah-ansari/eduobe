export interface RequestWithUser extends Request {
  user: {
    id: string;
    tenantId: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
  tenantId: string;
}
