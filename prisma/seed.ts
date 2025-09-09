// Database seeding script
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@camorphanage.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created:', {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });
  } else {
    console.log('ℹ️ Admin user already exists:', existingAdmin.email);
  }

  // Create sample orphanage for testing
  const orphanageEmail = 'orphanage@test.com';
  const existingOrphanageUser = await prisma.user.findUnique({
    where: { email: orphanageEmail },
  });

  if (!existingOrphanageUser) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const orphanageUser = await prisma.user.create({
      data: {
        email: orphanageEmail,
        passwordHash: hashedPassword,
        role: 'ORPHANAGE',
      },
    });

    const orphanageProfile = await prisma.orphanageProfile.create({
      data: {
        userId: orphanageUser.id,
        name: 'Hope Children Home',
        description: 'A loving home for children in need, providing education, care, and hope for a brighter future.',
        address: '123 Hope Street, Kindness City, KC 12345',
        directorName: 'Sarah Johnson',
        phone: '+1-555-0123',
        registrationNumber: 'ORG-2024-001',
        verificationStatus: 'VERIFIED',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    });

    // Add some sample needs
    await prisma.need.createMany({
      data: [
        {
          orphanageId: orphanageProfile.id,
          description: 'School supplies for 30 children (notebooks, pencils, backpacks)',
          status: 'ACTIVE',
        },
        {
          orphanageId: orphanageProfile.id,
          description: 'Winter clothing for children ages 5-15',
          status: 'ACTIVE',
        },
        {
          orphanageId: orphanageProfile.id,
          description: 'Educational books and learning materials',
          status: 'ACTIVE',
        },
      ],
    });

    console.log('✅ Sample orphanage created:', {
      id: orphanageProfile.id,
      name: orphanageProfile.name,
      email: orphanageUser.email,
    });
  } else {
    console.log('ℹ️ Sample orphanage already exists');
  }

  // Create sample organization for testing
  const orgEmail = 'organization@test.com';
  const existingOrgUser = await prisma.user.findUnique({
    where: { email: orgEmail },
  });

  if (!existingOrgUser) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const orgUser = await prisma.user.create({
      data: {
        email: orgEmail,
        passwordHash: hashedPassword,
        role: 'ORGANIZATION',
      },
    });

    await prisma.organizationProfile.create({
      data: {
        userId: orgUser.id,
        name: 'Helping Hands Foundation',
        contactPerson: 'Michael Smith',
        phone: '+1-555-0456',
        purposes: JSON.stringify(['DONATION', 'EDUCATION', 'HEALTHCARE']),
      },
    });

    console.log('✅ Sample organization created:', {
      name: 'Helping Hands Foundation',
      email: orgUser.email,
    });
  } else {
    console.log('ℹ️ Sample organization already exists');
  }

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Login Credentials:');
  console.log('👨‍💼 Admin:', adminEmail, '/', adminPassword);
  console.log('🏠 Orphanage:', orphanageEmail, '/ password123');
  console.log('🏢 Organization:', orgEmail, '/ password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
