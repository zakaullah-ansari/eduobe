import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

async function main() {
  console.log('🌱 Starting seed...\n');

  // ============================================================================
  // TENANT
  // ============================================================================
  console.log('📦 Creating tenant...');
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'vjti' },
    update: {},
    create: {
      name: 'Vishwakarma Institute of Technology',
      subdomain: 'vjti',
      primaryColor: '#1e40af',
      plan: 'professional',
      status: 'active',
      config: {
        academicYearStart: 'July',
        gradingSystem: 'CGPA_10',
        attendanceThreshold: 75,
      },
    },
  });
  console.log(`  ✓ ${tenant.name} (${tenant.subdomain})`);

  // ============================================================================
  // PERMISSIONS
  // ============================================================================
  console.log('\n🔐 Creating permissions...');
  const permissions = await Promise.all([
    // User permissions
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'user', action: 'read', scope: 'own' } },
      update: {},
      create: { resource: 'user', action: 'read', scope: 'own', description: 'Read own profile' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'user', action: 'read', scope: 'all' } },
      update: {},
      create: { resource: 'user', action: 'read', scope: 'all', description: 'Read all users' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'user', action: 'create', scope: 'all' } },
      update: {},
      create: { resource: 'user', action: 'create', scope: 'all', description: 'Create users' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'user', action: 'update', scope: 'all' } },
      update: {},
      create: { resource: 'user', action: 'update', scope: 'all', description: 'Update users' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'user', action: 'delete', scope: 'all' } },
      update: {},
      create: { resource: 'user', action: 'delete', scope: 'all', description: 'Delete users' },
    }),

    // Student permissions
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'student', action: 'read', scope: 'own' } },
      update: {},
      create: { resource: 'student', action: 'read', scope: 'own', description: 'Read own profile' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'student', action: 'read', scope: 'department' } },
      update: {},
      create: { resource: 'student', action: 'read', scope: 'department', description: 'Read students in department' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'student', action: 'read', scope: 'all' } },
      update: {},
      create: { resource: 'student', action: 'read', scope: 'all', description: 'Read all students' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'student', action: 'write', scope: 'all' } },
      update: {},
      create: { resource: 'student', action: 'write', scope: 'all', description: 'Create/update students' },
    }),

    // Marks permissions
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'marks', action: 'read', scope: 'own' } },
      update: {},
      create: { resource: 'marks', action: 'read', scope: 'own', description: 'Read own marks' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'marks', action: 'read', scope: 'course' } },
      update: {},
      create: { resource: 'marks', action: 'read', scope: 'course', description: 'Read marks in course' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'marks', action: 'write', scope: 'course' } },
      update: {},
      create: { resource: 'marks', action: 'write', scope: 'course', description: 'Enter marks for course' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'marks', action: 'approve', scope: 'department' } },
      update: {},
      create: { resource: 'marks', action: 'approve', scope: 'department', description: 'Approve marks in department' },
    }),

    // Attendance permissions
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'attendance', action: 'read', scope: 'own' } },
      update: {},
      create: { resource: 'attendance', action: 'read', scope: 'own', description: 'Read own attendance' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'attendance', action: 'read', scope: 'course' } },
      update: {},
      create: { resource: 'attendance', action: 'read', scope: 'course', description: 'Read attendance in course' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'attendance', action: 'write', scope: 'course' } },
      update: {},
      create: { resource: 'attendance', action: 'write', scope: 'course', description: 'Mark attendance for course' },
    }),

    // Attainment permissions
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'attainment', action: 'read', scope: 'course' } },
      update: {},
      create: { resource: 'attainment', action: 'read', scope: 'course', description: 'Read CO attainment' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'attainment', action: 'read', scope: 'program' } },
      update: {},
      create: { resource: 'attainment', action: 'read', scope: 'program', description: 'Read PO/PSO attainment' },
    }),
    prisma.permission.upsert({
      where: { resource_action_scope: { resource: 'attainment', action: 'calculate', scope: 'program' } },
      update: {},
      create: { resource: 'attainment', action: 'calculate', scope: 'program', description: 'Calculate attainment' },
    }),
  ]);
  console.log(`  ✓ ${permissions.length} permissions created`);

  // ============================================================================
  // ROLES
  // ============================================================================
  console.log('\n👥 Creating roles...');
  const rolesData = [
    { code: 'super_admin', name: 'Super Admin', description: 'Platform-wide administrator', isSystem: true },
    { code: 'tenant_admin', name: 'Tenant Admin', description: 'Institution administrator', isSystem: true },
    { code: 'principal', name: 'Principal', description: 'College principal', isSystem: true },
    { code: 'hod', name: 'HOD', description: 'Head of Department', isSystem: true },
    { code: 'iqac_coordinator', name: 'IQAC Coordinator', description: 'Quality assurance officer', isSystem: true },
    { code: 'nba_coordinator', name: 'NBA Coordinator', description: 'Accreditation lead', isSystem: true },
    { code: 'program_coordinator', name: 'Program Coordinator', description: 'Program lead faculty', isSystem: true },
    { code: 'faculty', name: 'Faculty', description: 'Teaching faculty', isSystem: true },
    { code: 'lab_instructor', name: 'Lab Instructor', description: 'Lab teaching staff', isSystem: true },
    { code: 'student', name: 'Student', description: 'Student', isSystem: true },
    { code: 'external_auditor', name: 'External Auditor', description: 'NBA/NAAC auditor', isSystem: true },
    { code: 'parent', name: 'Parent', description: "Student's parent", isSystem: true },
  ];

  const roles = await Promise.all(
    rolesData.map((r) =>
      prisma.role.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: r.code } },
        update: {},
        create: { tenantId: tenant.id, ...r },
      })
    )
  );
  console.log(`  ✓ ${roles.length} roles created`);

  // ============================================================================
  // USERS
  // ============================================================================
  console.log('\n👤 Creating users...');
  const adminPassword = await hashPassword('Admin@123');
  const facultyPassword = await hashPassword('Faculty@123');
  const studentPassword = await hashPassword('Student@123');

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@vjti.ac.in' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'admin@vjti.ac.in',
      passwordHash: adminPassword,
      firstName: 'System',
      lastName: 'Administrator',
      status: 'active',
      emailVerified: true,
    },
  });
  console.log(`  ✓ Admin: ${adminUser.email}`);

  // Faculty users
  const facultyData = [
    { email: 'rajesh.sharma@vjti.ac.in', firstName: 'Rajesh', lastName: 'Sharma', designation: 'professor', employeeId: 'FAC001', qualification: 'Ph.D. in Computer Science', specialization: 'Machine Learning' },
    { email: 'priya.patel@vjti.ac.in', firstName: 'Priya', lastName: 'Patel', designation: 'associate_professor', employeeId: 'FAC002', qualification: 'Ph.D. in Computer Engineering', specialization: 'Database Systems' },
    { email: 'amit.deshmukh@vjti.ac.in', firstName: 'Amit', lastName: 'Deshmukh', designation: 'assistant_professor', employeeId: 'FAC003', qualification: 'M.Tech in Computer Science', specialization: 'Data Structures' },
    { email: 'sneha.kulkarni@vjti.ac.in', firstName: 'Sneha', lastName: 'Kulkarni', designation: 'assistant_professor', employeeId: 'FAC004', qualification: 'M.Tech in Computer Engineering', specialization: 'Computer Networks' },
    { email: 'vikram.singh@vjti.ac.in', firstName: 'Vikram', lastName: 'Singh', designation: 'associate_professor', employeeId: 'FAC005', qualification: 'Ph.D. in Electronics', specialization: 'VLSI Design' },
  ];

  const facultyUsers = [];
  for (const f of facultyData) {
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: f.email } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: f.email,
        passwordHash: facultyPassword,
        firstName: f.firstName,
        lastName: f.lastName,
        status: 'active',
        emailVerified: true,
      },
    });
    facultyUsers.push(user);
    console.log(`  ✓ Faculty: ${f.email}`);
  }

  // Student users (30 students for CSE Batch 2023)
  const studentNames = [
    { firstName: 'Aarav', lastName: 'Sharma' },
    { firstName: 'Vivaan', lastName: 'Patel' },
    { firstName: 'Aditya', lastName: 'Kumar' },
    { firstName: 'Vihaan', lastName: 'Singh' },
    { firstName: 'Arjun', lastName: 'Reddy' },
    { firstName: 'Sai', lastName: 'Gupta' },
    { firstName: 'Reyansh', lastName: 'Verma' },
    { firstName: 'Ayaan', lastName: 'Joshi' },
    { firstName: 'Krishna', lastName: 'Iyer' },
    { firstName: 'Ishaan', lastName: 'Nair' },
    { firstName: 'Shaurya', lastName: 'Menon' },
    { firstName: 'Atharv', lastName: 'Pillai' },
    { firstName: 'Advait', lastName: 'Rao' },
    { firstName: 'Dhruv', lastName: 'Das' },
    { firstName: 'Kabir', lastName: 'Saxena' },
    { firstName: 'Ananya', lastName: 'Sharma' },
    { firstName: 'Diya', lastName: 'Patel' },
    { firstName: 'Myra', lastName: 'Singh' },
    { firstName: 'Sara', lastName: 'Khan' },
    { firstName: 'Aadhya', lastName: 'Reddy' },
    { firstName: 'Kiara', lastName: 'Gupta' },
    { firstName: 'Anika', lastName: 'Verma' },
    { firstName: 'Pari', lastName: 'Joshi' },
    { firstName: 'Riya', lastName: 'Iyer' },
    { firstName: 'Navya', lastName: 'Nair' },
    { firstName: 'Ishita', lastName: 'Menon' },
    { firstName: 'Saanvi', lastName: 'Pillai' },
    { firstName: 'Aanya', lastName: 'Rao' },
    { firstName: 'Pihu', lastName: 'Das' },
    { firstName: 'Tara', lastName: 'Saxena' },
  ];

  const studentUsers = [];
  for (let i = 0; i < studentNames.length; i++) {
    const name = studentNames[i];
    const rollNo = `2023CSE${String(i + 1).padStart(3, '0')}`;
    const email = `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}23@vjti.ac.in`;
    
    const user = await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email } },
      update: {},
      create: {
        tenantId: tenant.id,
        email,
        passwordHash: studentPassword,
        firstName: name.firstName,
        lastName: name.lastName,
        status: 'active',
        emailVerified: true,
      },
    });
    studentUsers.push({ user, rollNo });
  }
  console.log(`  ✓ ${studentUsers.length} students created`);

  // ============================================================================
  // DEPARTMENTS
  // ============================================================================
  console.log('\n🏛️ Creating departments...');
  const departmentsData = [
    { code: 'CSE', name: 'Computer Science & Engineering', vision: 'To be a center of excellence in computing education and research', mission: 'To produce competent engineers with strong fundamentals' },
    { code: 'ECE', name: 'Electronics & Communication Engineering', vision: 'Excellence in electronics and communication', mission: 'To develop skilled engineers' },
    { code: 'MECH', name: 'Mechanical Engineering', vision: 'Excellence in mechanical engineering', mission: 'To develop skilled engineers' },
    { code: 'CIVIL', name: 'Civil Engineering', vision: 'Excellence in civil engineering', mission: 'To develop skilled engineers' },
    { code: 'AIDS', name: 'Artificial Intelligence & Data Science', vision: 'Excellence in AI and Data Science', mission: 'To develop AI engineers' },
  ];

  const departments = await Promise.all(
    departmentsData.map((d) =>
      prisma.department.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: d.code } },
        update: {},
        create: { tenantId: tenant.id, ...d },
      })
    )
  );
  console.log(`  ✓ ${departments.length} departments created`);

  const cseDept = departments.find((d) => d.code === 'CSE')!;

  // ============================================================================
  // ACADEMIC YEAR
  // ============================================================================
  console.log('\n📅 Creating academic year...');
  const academicYear = await prisma.academicYear.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: '2024-25' } },
    update: {},
    create: {
      tenantId: tenant.id,
      name: '2024-25',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2025-06-30'),
      isCurrent: true,
      status: 'active',
    },
  });
  console.log(`  ✓ ${academicYear.name}`);

  // ============================================================================
  // COURSE TYPES
  // ============================================================================
  console.log('\n📚 Creating course types...');
  const courseTypesData = [
    { name: 'Theory', code: 'theory', attendanceMode: 'daily' as const, planType: 'teaching' as const, isSystem: true },
    { name: 'Laboratory', code: 'laboratory', attendanceMode: 'batch_wise' as const, planType: 'practical' as const, hasPractical: true, isSystem: true },
    { name: 'Project', code: 'project', attendanceMode: 'daily' as const, planType: 'project' as const, hasProject: true, isSystem: true },
    { name: 'Seminar', code: 'seminar', attendanceMode: 'daily' as const, planType: 'teaching' as const, isSystem: true },
    { name: 'Internship', code: 'internship', attendanceMode: 'daily' as const, planType: 'project' as const, isSystem: true },
    { name: 'Mini Project', code: 'mini_project', attendanceMode: 'daily' as const, planType: 'project' as const, hasProject: true, isSystem: true },
    { name: 'Capstone', code: 'capstone', attendanceMode: 'daily' as const, planType: 'project' as const, hasProject: true, isSystem: true },
  ];

  const courseTypes = await Promise.all(
    courseTypesData.map((ct) =>
      prisma.courseType.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: ct.code } },
        update: {},
        create: { tenantId: tenant.id, ...ct },
      })
    )
  );
  console.log(`  ✓ ${courseTypes.length} course types created`);

  const theoryType = courseTypes.find((ct) => ct.code === 'theory')!;
  const labType = courseTypes.find((ct) => ct.code === 'laboratory')!;

  // ============================================================================
  // ASSESSMENT TYPES
  // ============================================================================
  console.log('\n📝 Creating assessment types...');
  const assessmentTypesData = [
    { name: 'CIA', code: 'cia', category: 'formative' as const, isInternal: true, defaultMaxMarks: 30, defaultWeightage: 20 },
    { name: 'MSE', code: 'mse', category: 'formative' as const, isInternal: true, defaultMaxMarks: 40, defaultWeightage: 30 },
    { name: 'TEE', code: 'tee', category: 'summative' as const, isInternal: false, defaultMaxMarks: 100, defaultWeightage: 50 },
    { name: 'Quiz', code: 'quiz', category: 'formative' as const, isInternal: true, defaultMaxMarks: 10 },
    { name: 'Assignment', code: 'assignment', category: 'formative' as const, isInternal: true, defaultMaxMarks: 20 },
    { name: 'Lab Exam', code: 'lab_exam', category: 'formative' as const, isInternal: true, defaultMaxMarks: 25 },
    { name: 'Viva', code: 'viva', category: 'formative' as const, isInternal: true, defaultMaxMarks: 20 },
    { name: 'Project Review', code: 'project_review', category: 'summative' as const, isInternal: true, defaultMaxMarks: 50 },
  ];

  const assessmentTypes = await Promise.all(
    assessmentTypesData.map((at) =>
      prisma.assessmentType.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: at.code } },
        update: {},
        create: { tenantId: tenant.id, ...at },
      })
    )
  );
  console.log(`  ✓ ${assessmentTypes.length} assessment types created`);

  const ciaType = assessmentTypes.find((at) => at.code === 'cia')!;
  const mseType = assessmentTypes.find((at) => at.code === 'mse')!;
  const teeType = assessmentTypes.find((at) => at.code === 'tee')!;

  // ============================================================================
  // PROGRAMS
  // ============================================================================
  console.log('\n🎓 Creating programs...');
  const programsData = [
    { code: 'BTECH_CSE', name: 'B.Tech Computer Science & Engineering', degreeType: 'btech' as const, duration: 4, totalSemesters: 8, departmentId: cseDept.id },
    { code: 'BTECH_ECE', name: 'B.Tech Electronics & Communication', degreeType: 'btech' as const, duration: 4, totalSemesters: 8, departmentId: departments.find((d) => d.code === 'ECE')!.id },
    { code: 'BTECH_AIDS', name: 'B.Tech AI & Data Science', degreeType: 'btech' as const, duration: 4, totalSemesters: 8, departmentId: departments.find((d) => d.code === 'AIDS')!.id },
    { code: 'MTECH_CSE', name: 'M.Tech Computer Science', degreeType: 'mtech' as const, duration: 2, totalSemesters: 4, departmentId: cseDept.id },
  ];

  const programs = await Promise.all(
    programsData.map((p) =>
      prisma.program.upsert({
        where: { tenantId_code: { tenantId: tenant.id, code: p.code } },
        update: {},
        create: { tenantId: tenant.id, ...p },
      })
    )
  );
  console.log(`  ✓ ${programs.length} programs created`);

  const btechCSE = programs.find((p) => p.code === 'BTECH_CSE')!;

  // ============================================================================
  // CURRICULUM
  // ============================================================================
  console.log('\n📖 Creating curriculum...');
  const curriculum = await prisma.curriculum.upsert({
    where: { tenantId_programId_version: { tenantId: tenant.id, programId: btechCSE.id, version: 'R2023' } },
    update: {},
    create: {
      tenantId: tenant.id,
      programId: btechCSE.id,
      version: 'R2023',
      name: 'B.Tech CSE Curriculum 2023',
      effectiveFrom: '2023-24',
      status: 'active',
    },
  });
  console.log(`  ✓ ${curriculum.name}`);

  // ============================================================================
  // SEMESTERS
  // ============================================================================
  console.log('\n📆 Creating semesters...');
  const semesters = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      prisma.semester.upsert({
        where: { curriculumId_number: { curriculumId: curriculum.id, number: i + 1 } },
        update: {},
        create: {
          tenantId: tenant.id,
          curriculumId: curriculum.id,
          number: i + 1,
          name: `Semester ${i + 1}`,
          status: 'active',
        },
      })
    )
  );
  console.log(`  ✓ ${semesters.length} semesters created`);

  const sem3 = semesters[2]!;

  // ============================================================================
  // COURSES (Semester 3 CSE)
  // ============================================================================
  console.log('\n📚 Creating courses...');
  const coursesData = [
    { code: 'CSE301', name: 'Data Structures and Algorithms', shortName: 'DSA', credits: 4, lectureHours: 3, tutorialHours: 1, practicalHours: 2, courseTypeId: theoryType.id, semesterId: sem3.id },
    { code: 'CSE302', name: 'Database Management Systems', shortName: 'DBMS', credits: 4, lectureHours: 3, tutorialHours: 1, practicalHours: 2, courseTypeId: theoryType.id, semesterId: sem3.id },
    { code: 'CSE303', name: 'Computer Organization', shortName: 'CO', credits: 3, lectureHours: 3, tutorialHours: 0, practicalHours: 0, courseTypeId: theoryType.id, semesterId: sem3.id },
    { code: 'CSE304', name: 'Discrete Mathematics', shortName: 'DM', credits: 3, lectureHours: 3, tutorialHours: 1, practicalHours: 0, courseTypeId: theoryType.id, semesterId: sem3.id },
    { code: 'CSE305', name: 'Object Oriented Programming', shortName: 'OOP', credits: 3, lectureHours: 2, tutorialHours: 0, practicalHours: 2, courseTypeId: theoryType.id, semesterId: sem3.id },
    { code: 'CSE306', name: 'DSA Lab', shortName: 'DSA Lab', credits: 2, lectureHours: 0, tutorialHours: 0, practicalHours: 4, courseTypeId: labType.id, semesterId: sem3.id },
    { code: 'CSE307', name: 'DBMS Lab', shortName: 'DBMS Lab', credits: 2, lectureHours: 0, tutorialHours: 0, practicalHours: 4, courseTypeId: labType.id, semesterId: sem3.id },
  ];

  const courses = await Promise.all(
    coursesData.map((c) =>
      prisma.course.upsert({
        where: { tenantId_curriculumId_code: { tenantId: tenant.id, curriculumId: curriculum.id, code: c.code } },
        update: {},
        create: { tenantId: tenant.id, curriculumId: curriculum.id, ...c },
      })
    )
  );
  console.log(`  ✓ ${courses.length} courses created`);

  const dsaCourse = courses.find((c) => c.code === 'CSE301')!;
  const dbmsCourse = courses.find((c) => c.code === 'CSE302')!;

  // ============================================================================
  // BATCHES
  // ============================================================================
  console.log('\n👥 Creating batches...');
  const batch2023 = await prisma.batch.upsert({
    where: { tenantId_programId_admissionYear: { tenantId: tenant.id, programId: btechCSE.id, admissionYear: 2023 } },
    update: {},
    create: {
      tenantId: tenant.id,
      programId: btechCSE.id,
      academicYearId: academicYear.id,
      name: 'B.Tech CSE 2023',
      admissionYear: 2023,
      currentSemester: 3,
      status: 'active',
    },
  });
  console.log(`  ✓ ${batch2023.name}`);

  // ============================================================================
  // SECTIONS
  // ============================================================================
  console.log('\n📋 Creating sections...');
  const sectionsData = [
    { name: 'A', maxStrength: 60 },
    { name: 'B', maxStrength: 60 },
    { name: 'C', maxStrength: 60 },
  ];

  const sections = await Promise.all(
    sectionsData.map((s) =>
      prisma.section.upsert({
        where: { batchId_name: { batchId: batch2023.id, name: s.name } },
        update: {},
        create: { tenantId: tenant.id, batchId: batch2023.id, ...s },
      })
    )
  );
  console.log(`  ✓ ${sections.length} sections created`);

  const sectionA = sections[0]!;

  // ============================================================================
  // STUDENTS
  // ============================================================================
  console.log('\n🎓 Creating student records...');
  const students = [];
  for (let i = 0; i < studentUsers.length; i++) {
    const { user, rollNo } = studentUsers[i];
    const section = i < 30 ? sectionA : sections[1]; // First 30 in Section A, rest in B
    
    const student = await prisma.student.upsert({
      where: { tenantId_rollNumber: { tenantId: tenant.id, rollNumber: rollNo } },
      update: {},
      create: {
        tenantId: tenant.id,
        userId: user.id,
        rollNumber: rollNo,
        prnNumber: `1202${String(i + 1).padStart(4, '0')}`,
        batchId: batch2023.id,
        sectionId: section.id,
        currentSemester: 3,
        admissionYear: 2023,
        admissionType: 'regular',
        category: i % 5 === 0 ? 'OBC' : 'General',
        status: 'active',
      },
    });
    students.push(student);
  }
  console.log(`  ✓ ${students.length} student records created`);

  // ============================================================================
  // FACULTY RECORDS
  // ============================================================================
  console.log('\n👨‍🏫 Creating faculty records...');
  const facultyRecords = [];
  for (let i = 0; i < facultyUsers.length; i++) {
    const user = facultyUsers[i];
    const data = facultyData[i];
    
    const faculty = await prisma.faculty.upsert({
      where: { tenantId_employeeId: { tenantId: tenant.id, employeeId: data.employeeId } },
      update: {},
      create: {
        tenantId: tenant.id,
        userId: user.id,
        departmentId: i < 4 ? cseDept.id : departments.find((d) => d.code === 'ECE')!.id,
        employeeId: data.employeeId,
        designation: data.designation,
        qualification: data.qualification,
        specialization: data.specialization,
        employmentType: 'permanent',
        status: 'active',
      },
    });
    facultyRecords.push(faculty);
  }
  console.log(`  ✓ ${facultyRecords.length} faculty records created`);

  const profSharma = facultyRecords[0]!;
  const profPatel = facultyRecords[1]!;

  // ============================================================================
  // COURSE OFFERINGS
  // ============================================================================
  console.log('\n📖 Creating course offerings...');
  const dsaOffering = await prisma.courseOffering.upsert({
    where: { courseId_academicYearId_sectionId: { courseId: dsaCourse.id, academicYearId: academicYear.id, sectionId: sectionA.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      courseId: dsaCourse.id,
      academicYearId: academicYear.id,
      semesterNumber: 3,
      sectionId: sectionA.id,
      batchId: batch2023.id,
      facultyId: profSharma.id,
      status: 'active',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-11-30'),
    },
  });

  const dbmsOffering = await prisma.courseOffering.upsert({
    where: { courseId_academicYearId_sectionId: { courseId: dbmsCourse.id, academicYearId: academicYear.id, sectionId: sectionA.id } },
    update: {},
    create: {
      tenantId: tenant.id,
      courseId: dbmsCourse.id,
      academicYearId: academicYear.id,
      semesterNumber: 3,
      sectionId: sectionA.id,
      batchId: batch2023.id,
      facultyId: profPatel.id,
      status: 'active',
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-11-30'),
    },
  });
  console.log(`  ✓ 2 course offerings created (DSA, DBMS)`);

  // ============================================================================
  // COURSE ENROLLMENTS
  // ============================================================================
  console.log('\n📝 Creating course enrollments...');
  const enrollments = [];
  for (const student of students.slice(0, 30)) {
    const dsaEnrollment = await prisma.courseEnrollment.upsert({
      where: { studentId_courseOfferingId: { studentId: student.id, courseOfferingId: dsaOffering.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        studentId: student.id,
        courseOfferingId: dsaOffering.id,
        enrollmentDate: new Date('2024-07-15'),
        status: 'enrolled',
      },
    });

    const dbmsEnrollment = await prisma.courseEnrollment.upsert({
      where: { studentId_courseOfferingId: { studentId: student.id, courseOfferingId: dbmsOffering.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        studentId: student.id,
        courseOfferingId: dbmsOffering.id,
        enrollmentDate: new Date('2024-07-15'),
        status: 'enrolled',
      },
    });

    enrollments.push(dsaEnrollment, dbmsEnrollment);
  }
  console.log(`  ✓ ${enrollments.length} enrollments created`);

  // ============================================================================
  // PROGRAM OUTCOMES (PO1-PO12)
  // ============================================================================
  console.log('\n🎯 Creating Program Outcomes...');
  const posData = [
    { number: 'PO1', description: 'Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.' },
    { number: 'PO2', description: 'Problem analysis: Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.' },
    { number: 'PO3', description: 'Design/development of solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.' },
    { number: 'PO4', description: 'Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data and synthesis of the information to provide valid conclusions.' },
    { number: 'PO5', description: 'Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.' },
    { number: 'PO6', description: 'The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal and cultural issues and the consequent responsibilities relevant to the professional engineering practice.' },
    { number: 'PO7', description: 'Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.' },
    { number: 'PO8', description: 'Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.' },
    { number: 'PO9', description: 'Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.' },
    { number: 'PO10', description: 'Communication: Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.' },
    { number: 'PO11', description: 'Project management and finance: Demonstrate knowledge and understanding of the engineering and management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.' },
    { number: 'PO12', description: 'Life-long learning: Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.' },
  ];

  const pos = await Promise.all(
    posData.map((po) =>
      prisma.programOutcome.upsert({
        where: { programId_poNumber: { programId: btechCSE.id, poNumber: po.number } },
        update: {},
        create: { tenantId: tenant.id, programId: btechCSE.id, ...po },
      })
    )
  );
  console.log(`  ✓ ${pos.length} Program Outcomes created`);

  // ============================================================================
  // PROGRAM SPECIFIC OUTCOMES (PSOs)
  // ============================================================================
  console.log('\n🎯 Creating Program Specific Outcomes...');
  const psosData = [
    { number: 'PSO1', description: 'Analyze, design, and develop software systems using modern programming languages and tools to solve real-world problems.' },
    { number: 'PSO2', description: 'Apply data structures, algorithms, and computational thinking to develop efficient and scalable solutions.' },
    { number: 'PSO3', description: 'Demonstrate professional and ethical responsibilities in the context of societal and environmental impact of computing solutions.' },
  ];

  const psos = await Promise.all(
    psosData.map((pso) =>
      prisma.programSpecificOutcome.upsert({
        where: { programId_psoNumber: { programId: btechCSE.id, psoNumber: pso.number } },
        update: {},
        create: { tenantId: tenant.id, programId: btechCSE.id, ...pso },
      })
    )
  );
  console.log(`  ✓ ${psos.length} Program Specific Outcomes created`);

  // ============================================================================
  // COURSE OUTCOMES (for DSA)
  // ============================================================================
  console.log('\n🎯 Creating Course Outcomes for DSA...');
  const dsaCOsData = [
    { number: 'CO1', description: 'Understand and apply fundamental data structures like arrays, linked lists, stacks, and queues to solve programming problems.', bloomLevel: 'L2_understand' as const },
    { number: 'CO2', description: 'Analyze time and space complexity of algorithms using Big-O notation and select appropriate algorithms for given problems.', bloomLevel: 'L4_analyze' as const },
    { number: 'CO3', description: 'Implement tree and graph data structures and apply traversal algorithms (BFS, DFS) to solve real-world problems.', bloomLevel: 'L3_apply' as const },
    { number: 'CO4', description: 'Design and implement sorting and searching algorithms and evaluate their efficiency for different data sets.', bloomLevel: 'L5_evaluate' as const },
    { number: 'CO5', description: 'Develop solutions to complex problems using dynamic programming and greedy algorithms.', bloomLevel: 'L6_create' as const },
  ];

  const dsaCOs = await Promise.all(
    dsaCOsData.map((co) =>
      prisma.courseOutcome.upsert({
        where: { courseOfferingId_coNumber: { courseOfferingId: dsaOffering.id, coNumber: co.number } },
        update: {},
        create: {
          tenantId: tenant.id,
          courseOfferingId: dsaOffering.id,
          description: co.description,
          bloomLevel: co.bloomLevel,
          targetAttainmentLevel: 0.6,
          createdBy: profSharma.userId,
          status: 'approved',
          approvedBy: profSharma.userId,
          approvedAt: new Date(),
        },
      })
    )
  );
  console.log(`  ✓ ${dsaCOs.length} Course Outcomes created for DSA`);

  // ============================================================================
  // CO-PO MAPPINGS (for DSA)
  // ============================================================================
  console.log('\n🔗 Creating CO-PO mappings for DSA...');
  const coPOMappingData = [
    { co: dsaCOs[0], po: pos[0], level: 3 }, // CO1 -> PO1 (Engineering Knowledge)
    { co: dsaCOs[0], po: pos[1], level: 2 }, // CO1 -> PO2 (Problem Analysis)
    { co: dsaCOs[1], po: pos[1], level: 3 }, // CO2 -> PO2
    { co: dsaCOs[1], po: pos[4], level: 2 }, // CO2 -> PO5 (Modern Tools)
    { co: dsaCOs[2], po: pos[2], level: 3 }, // CO3 -> PO3 (Design)
    { co: dsaCOs[2], po: pos[4], level: 3 }, // CO3 -> PO5
    { co: dsaCOs[3], po: pos[3], level: 2 }, // CO4 -> PO4 (Investigations)
    { co: dsaCOs[3], po: pos[4], level: 3 }, // CO4 -> PO5
    { co: dsaCOs[4], po: pos[2], level: 3 }, // CO5 -> PO3
    { co: dsaCOs[4], po: pos[4], level: 3 }, // CO5 -> PO5
  ];

  const coPOMappings = await Promise.all(
    coPOMappingData.map((mapping) =>
      prisma.cOPOMapping.upsert({
        where: { courseOutcomeId_programOutcomeId: { courseOutcomeId: mapping.co.id, programOutcomeId: mapping.po.id } },
        update: {},
        create: {
          tenantId: tenant.id,
          courseOutcomeId: mapping.co.id,
          programOutcomeId: mapping.po.id,
          mappingLevel: mapping.level,
        },
      })
    )
  );
  console.log(`  ✓ ${coPOMappings.length} CO-PO mappings created`);

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n✅ Seed completed successfully!');
  console.log('\n📊 Database Summary:');
  console.log(`  - Tenant: ${tenant.name}`);
  console.log(`  - Departments: ${departments.length}`);
  console.log(`  - Programs: ${programs.length}`);
  console.log(`  - Courses: ${courses.length}`);
  console.log(`  - Students: ${students.length}`);
  console.log(`  - Faculty: ${facultyRecords.length}`);
  console.log(`  - Course Offerings: 2 (DSA, DBMS)`);
  console.log(`  - Program Outcomes: ${pos.length}`);
  console.log(`  - Program Specific Outcomes: ${psos.length}`);
  console.log(`  - Course Outcomes: ${dsaCOs.length} (DSA)`);
  console.log(`  - CO-PO Mappings: ${coPOMappings.length}`);
  
  console.log('\n🔑 Login Credentials:');
  console.log(`  Admin: admin@vjti.ac.in / Admin@123`);
  console.log(`  Faculty: rajesh.sharma@vjti.ac.in / Faculty@123`);
  console.log(`  Student: aarav.sharma23@vjti.ac.in / Student@123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
