// Quick script to create an admin user
// Run this in your browser console on localhost:3000

async function createAdminUser() {
    const { createClient } = await import('./src/lib/supabase/client.ts');
    const supabase = createClient();

    // Sign up admin user
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@test.com',
        password: 'admin123',
        options: {
            data: {
                role: 'admin',
                name: 'Test Admin'
            }
        }
    });

    if (error) {
        console.error('Error creating admin:', error);
    } else {
        console.log('Admin user created successfully:', data);
    }
}

createAdminUser();
