// update-passwords.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function updateAllPasswords() {
    console.log('🔐 Starting password update for all users...');
    
    try {
        // Get all users
        const [users] = await db.execute('SELECT user_id, email FROM users');
        
        console.log(`Found ${users.length} users to update`);
        
        // Hash the password once (same for all users for testing)
        const hashedPassword = await bcrypt.hash('Password123!', 10);
        console.log('Generated hash:', hashedPassword.substring(0, 20) + '...');
        
        // Update each user
        let successCount = 0;
        for (const user of users) {
            await db.execute(
                'UPDATE users SET password = ? WHERE user_id = ?',
                [hashedPassword, user.user_id]
            );
            console.log(`✅ Updated password for: ${user.email}`);
            successCount++;
        }
        
        console.log('\n=================================');
        console.log('🎉 PASSWORD UPDATE COMPLETE!');
        console.log('=================================');
        console.log(`✅ ${successCount} users updated successfully`);
        console.log('\n📝 All users now have password:');
        console.log('   🔑 Password123!');
        console.log('\n👥 Test with any of these emails:');
        
        // Show sample users
        const [sampleUsers] = await db.execute(
            'SELECT email, full_name FROM users LIMIT 5'
        );
        sampleUsers.forEach(user => {
            console.log(`   • ${user.email} (${user.full_name})`);
        });
        
        if (users.length > 5) {
            console.log(`   • ... and ${users.length - 5} more users`);
        }
        
    } catch (error) {
        console.error('❌ Error updating passwords:', error);
    } finally {
        process.exit();
    }
}

updateAllPasswords();