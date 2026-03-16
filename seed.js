// seed.js - Database seeding script
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');
    
    try {
        // Clear existing data (optional - be careful!)
        console.log('Clearing existing data...');
        await db.execute('SET FOREIGN_KEY_CHECKS = 0');
        await db.execute('TRUNCATE TABLE reviews');
        await db.execute('TRUNCATE TABLE matches');
        await db.execute('TRUNCATE TABLE requests');
        await db.execute('TRUNCATE TABLE offers');
        await db.execute('TRUNCATE TABLE availability');
        await db.execute('TRUNCATE TABLE users');
        await db.execute('TRUNCATE TABLE skills');
        await db.execute('TRUNCATE TABLE categories');
        await db.execute('SET FOREIGN_KEY_CHECKS = 1');
        
        // ==================== CATEGORIES ====================
        console.log('Adding categories...');
        const categories = [
            'Programming & Development',
            'Music & Audio',
            'Language Learning',
            'Sports & Fitness',
            'Art & Design',
            'Cooking & Baking',
            'Photography & Video',
            'Business & Finance',
            'Writing & Content',
            'Marketing & SEO',
            'Personal Development',
            'Home & Garden',
            'Crafts & DIY',
            'Dance & Performance',
            'Yoga & Meditation',
            'Gaming & Esports',
            'Science & Education',
            'Fashion & Style',
            'Health & Wellness',
            'Travel & Adventure'
        ];
        
        const categoryIds = {};
        for (const category of categories) {
            const [result] = await db.execute(
                'INSERT INTO categories (category_name) VALUES (?)',
                [category]
            );
            categoryIds[category] = result.insertId;
            console.log(`  ✓ Added category: ${category}`);
        }
        
        // ==================== SKILLS ====================
        console.log('\nAdding skills...');
        const skills = [
            // Programming
            { name: 'JavaScript', category: 'Programming & Development' },
            { name: 'Python', category: 'Programming & Development' },
            { name: 'Java', category: 'Programming & Development' },
            { name: 'C++', category: 'Programming & Development' },
            { name: 'React.js', category: 'Programming & Development' },
            { name: 'Node.js', category: 'Programming & Development' },
            { name: 'SQL', category: 'Programming & Development' },
            { name: 'HTML/CSS', category: 'Programming & Development' },
            { name: 'PHP', category: 'Programming & Development' },
            { name: 'Ruby on Rails', category: 'Programming & Development' },
            { name: 'iOS Development', category: 'Programming & Development' },
            { name: 'Android Development', category: 'Programming & Development' },
            { name: 'UI/UX Design', category: 'Programming & Development' },
            
            // Music
            { name: 'Guitar', category: 'Music & Audio' },
            { name: 'Piano', category: 'Music & Audio' },
            { name: 'Drums', category: 'Music & Audio' },
            { name: 'Violin', category: 'Music & Audio' },
            { name: 'Singing', category: 'Music & Audio' },
            { name: 'Music Production', category: 'Music & Audio' },
            { name: 'DJing', category: 'Music & Audio' },
            { name: 'Music Theory', category: 'Music & Audio' },
            
            // Languages
            { name: 'Spanish', category: 'Language Learning' },
            { name: 'French', category: 'Language Learning' },
            { name: 'German', category: 'Language Learning' },
            { name: 'Italian', category: 'Language Learning' },
            { name: 'Japanese', category: 'Language Learning' },
            { name: 'Chinese', category: 'Language Learning' },
            { name: 'Korean', category: 'Language Learning' },
            { name: 'Russian', category: 'Language Learning' },
            { name: 'Arabic', category: 'Language Learning' },
            { name: 'Portuguese', category: 'Language Learning' },
            { name: 'English', category: 'Language Learning' },
            
            // Sports
            { name: 'Tennis', category: 'Sports & Fitness' },
            { name: 'Basketball', category: 'Sports & Fitness' },
            { name: 'Soccer', category: 'Sports & Fitness' },
            { name: 'Swimming', category: 'Sports & Fitness' },
            { name: 'Gym Training', category: 'Sports & Fitness' },
            { name: 'Yoga', category: 'Sports & Fitness' },
            { name: 'Martial Arts', category: 'Sports & Fitness' },
            { name: 'Rock Climbing', category: 'Sports & Fitness' },
            
            // Art
            { name: 'Painting', category: 'Art & Design' },
            { name: 'Drawing', category: 'Art & Design' },
            { name: 'Digital Art', category: 'Art & Design' },
            { name: 'Graphic Design', category: 'Art & Design' },
            { name: '3D Modeling', category: 'Art & Design' },
            
            // Cooking
            { name: 'Italian Cuisine', category: 'Cooking & Baking' },
            { name: 'Japanese Cuisine', category: 'Cooking & Baking' },
            { name: 'Baking', category: 'Cooking & Baking' },
            { name: 'Vegan Cooking', category: 'Cooking & Baking' },
            { name: 'Wine Tasting', category: 'Cooking & Baking' },
            
            // Photography
            { name: 'Portrait Photography', category: 'Photography & Video' },
            { name: 'Landscape Photography', category: 'Photography & Video' },
            { name: 'Video Editing', category: 'Photography & Video' },
            { name: 'Adobe Photoshop', category: 'Photography & Video' },
            { name: 'Lightroom', category: 'Photography & Video' },
            
            // Business
            { name: 'Financial Planning', category: 'Business & Finance' },
            { name: 'Stock Trading', category: 'Business & Finance' },
            { name: 'Cryptocurrency', category: 'Business & Finance' },
            { name: 'Business Strategy', category: 'Business & Finance' },
            { name: 'Public Speaking', category: 'Business & Finance' },
            
            // Writing
            { name: 'Creative Writing', category: 'Writing & Content' },
            { name: 'Technical Writing', category: 'Writing & Content' },
            { name: 'Blogging', category: 'Writing & Content' },
            { name: 'Copywriting', category: 'Writing & Content' },
            { name: 'Poetry', category: 'Writing & Content' },
            
            // Marketing
            { name: 'Social Media Marketing', category: 'Marketing & SEO' },
            { name: 'SEO', category: 'Marketing & SEO' },
            { name: 'Content Marketing', category: 'Marketing & SEO' },
            { name: 'Email Marketing', category: 'Marketing & SEO' },
            { name: 'Google Analytics', category: 'Marketing & SEO' },
            
            // Personal Development
            { name: 'Meditation', category: 'Personal Development' },
            { name: 'Time Management', category: 'Personal Development' },
            { name: 'Leadership', category: 'Personal Development' },
            { name: 'Negotiation', category: 'Personal Development' },
            { name: 'Emotional Intelligence', category: 'Personal Development' },
            
            // Dance
            { name: 'Dance', category: 'Dance & Performance' },
            { name: 'Salsa', category: 'Dance & Performance' },
            { name: 'Bachata', category: 'Dance & Performance' },
            
            // Health
            { name: 'Nutrition', category: 'Health & Wellness' },
            { name: 'Fitness', category: 'Health & Wellness' }
        ];
        
        const skillIds = {};
        for (const skill of skills) {
            const [result] = await db.execute(
                'INSERT INTO skills (skill_name, category_id) VALUES (?, ?)',
                [skill.name, categoryIds[skill.category]]
            );
            skillIds[skill.name] = result.insertId;
            console.log(`  ✓ Added skill: ${skill.name}`);
        }
        
        // ==================== USERS ====================
        console.log('\nAdding users...');
        const users = [
            {
                full_name: 'Alex Johnson',
                username: 'alex_coder',
                email: 'alex@example.com',
                phone: '+1234567890',
                password: 'Password123!',
                bio: 'Full-stack developer passionate about teaching JavaScript'
            },
            {
                full_name: 'Maria Garcia',
                username: 'maria_guitar',
                email: 'maria@example.com',
                phone: '+1234567891',
                password: 'Password123!',
                bio: 'Guitar teacher with 10 years experience'
            },
            {
                full_name: 'John Smith',
                username: 'john_sports',
                email: 'john@example.com',
                phone: '+1234567892',
                password: 'Password123!',
                bio: 'Tennis coach and fitness trainer'
            },
            {
                full_name: 'Sophie Chen',
                username: 'sophie_art',
                email: 'sophie@example.com',
                phone: '+1234567893',
                password: 'Password123!',
                bio: 'Digital artist and painter'
            },
            {
                full_name: 'David Kim',
                username: 'david_cook',
                email: 'david@example.com',
                phone: '+1234567894',
                password: 'Password123!',
                bio: 'Professional chef specializing in Asian cuisine'
            },
            {
                full_name: 'Emma Wilson',
                username: 'emma_photo',
                email: 'emma@example.com',
                phone: '+1234567895',
                password: 'Password123!',
                bio: 'Portrait photographer and Lightroom expert'
            },
            {
                full_name: 'Carlos Rodriguez',
                username: 'carlos_lang',
                email: 'carlos@example.com',
                phone: '+1234567896',
                password: 'Password123!',
                bio: 'Spanish native speaker, English teacher'
            },
            {
                full_name: 'Lisa Thompson',
                username: 'lisa_yoga',
                email: 'lisa@example.com',
                phone: '+1234567897',
                password: 'Password123!',
                bio: 'Yoga instructor and meditation guide'
            },
            {
                full_name: 'Mike Brown',
                username: 'mike_finance',
                email: 'mike@example.com',
                phone: '+1234567898',
                password: 'Password123!',
                bio: 'Financial advisor and stock market enthusiast'
            },
            {
                full_name: 'Nina Patel',
                username: 'nina_dance',
                email: 'nina@example.com',
                phone: '+1234567899',
                password: 'Password123!',
                bio: 'Professional dancer (Salsa, Bachata)'
            }
        ];
        
        const userIds = [];
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            const [result] = await db.execute(
                'INSERT INTO users (full_name, username, email, phone_number, password) VALUES (?, ?, ?, ?, ?)',
                [user.full_name, user.username, user.email, user.phone, hashedPassword]
            );
            userIds.push(result.insertId);
            console.log(`  ✓ Added user: ${user.full_name} (${user.username})`);
        }
        
        // ==================== OFFERS ====================
        console.log('\nAdding skill offers...');
        const offers = [
            { user: 'alex_coder', skill: 'JavaScript', description: 'I can teach JavaScript from basics to advanced. 5 years of experience.' },
            { user: 'alex_coder', skill: 'React.js', description: 'Learn React with hooks, context, and Redux. Build real projects.' },
            { user: 'maria_guitar', skill: 'Guitar', description: 'Acoustic and electric guitar lessons for beginners to intermediate.' },
            { user: 'maria_guitar', skill: 'Music Theory', description: 'Learn music theory, chord progressions, and songwriting.' },
            { user: 'john_sports', skill: 'Tennis', description: 'Tennis lessons for all levels. Former college player.' },
            { user: 'john_sports', skill: 'Gym Training', description: 'Personal training and workout planning.' },
            { user: 'sophie_art', skill: 'Digital Art', description: 'Learn digital painting in Procreate and Photoshop.' },
            { user: 'sophie_art', skill: 'Drawing', description: 'Fundamentals of drawing: perspective, shading, composition.' },
            { user: 'david_cook', skill: 'Japanese Cuisine', description: 'Learn to make sushi, ramen, and other Japanese dishes.' },
            { user: 'david_cook', skill: 'Italian Cuisine', description: 'Homemade pasta, pizza, and Italian classics.' },
            { user: 'emma_photo', skill: 'Portrait Photography', description: 'Master portrait photography with natural and studio light.' },
            { user: 'emma_photo', skill: 'Adobe Photoshop', description: 'Photo retouching and manipulation in Photoshop.' },
            { user: 'carlos_lang', skill: 'Spanish', description: 'Native Spanish speaker offering conversation practice.' },
            { user: 'carlos_lang', skill: 'English', description: 'ESL tutoring for Spanish speakers.' },
            { user: 'lisa_yoga', skill: 'Yoga', description: 'Hatha and Vinyasa yoga for all levels.' },
            { user: 'lisa_yoga', skill: 'Meditation', description: 'Guided meditation and mindfulness practices.' },
            { user: 'mike_finance', skill: 'Stock Trading', description: 'Learn technical analysis and trading strategies.' },
            { user: 'mike_finance', skill: 'Financial Planning', description: 'Personal finance, budgeting, and investment planning.' },
            { user: 'nina_dance', skill: 'Dance', description: 'Salsa and Bachata lessons for beginners.' },
            { user: 'nina_dance', skill: 'Fitness', description: 'Dance fitness and Zumba classes.' }
        ];
        
        const offerIds = [];
        for (const offer of offers) {
            const userIndex = users.findIndex(u => u.username === offer.user);
            const [result] = await db.execute(
                'INSERT INTO offers (user_id, skill_id, description) VALUES (?, ?, ?)',
                [userIds[userIndex], skillIds[offer.skill], offer.description]
            );
            offerIds.push(result.insertId);
            console.log(`  ✓ Added offer: ${offer.user} offers ${offer.skill}`);
        }
        
        // ==================== REQUESTS ====================
        console.log('\nAdding skill requests...');
        const requests = [
            { user: 'alex_coder', skill: 'Spanish', description: 'Want to learn Spanish for an upcoming trip to Spain.' },
            { user: 'alex_coder', skill: 'Guitar', description: 'Always wanted to learn guitar. Complete beginner.' },
            { user: 'maria_guitar', skill: 'JavaScript', description: 'Want to build a website for my music studio.' },
            { user: 'maria_guitar', skill: 'Portrait Photography', description: 'Learn to take better photos for social media.' },
            { user: 'john_sports', skill: 'Nutrition', description: 'Want to learn about sports nutrition and meal planning.' },
            { user: 'john_sports', skill: 'Portrait Photography', description: 'Need to learn photography for my sports blog.' },
            { user: 'sophie_art', skill: 'UI/UX Design', description: 'Want to create a portfolio website for my art.' },
            { user: 'sophie_art', skill: 'Social Media Marketing', description: 'Learn to market my art on social media.' },
            { user: 'david_cook', skill: 'Portrait Photography', description: 'Need food photography skills for my recipe blog.' },
            { user: 'david_cook', skill: 'Social Media Marketing', description: 'Learn to promote my cooking on Instagram.' },
            { user: 'emma_photo', skill: 'UI/UX Design', description: 'Want to build a photography portfolio site.' },
            { user: 'emma_photo', skill: 'Social Media Marketing', description: 'Learn to market my photography business.' },
            { user: 'carlos_lang', skill: 'JavaScript', description: 'Want to learn programming to build language apps.' },
            { user: 'carlos_lang', skill: 'Guitar', description: 'Always wanted to learn guitar.' },
            { user: 'lisa_yoga', skill: 'UI/UX Design', description: 'Need a website for my yoga classes.' },
            { user: 'lisa_yoga', skill: 'Portrait Photography', description: 'Learn to take better yoga photos.' },
            { user: 'mike_finance', skill: 'Public Speaking', description: 'Want to improve my presentation skills.' },
            { user: 'mike_finance', skill: 'Creative Writing', description: 'Learn to write better financial articles.' },
            { user: 'nina_dance', skill: 'Social Media Marketing', description: 'Want to grow my dance studio on social media.' },
            { user: 'nina_dance', skill: 'Video Editing', description: 'Learn to edit dance videos for YouTube.' }
        ];
        
        const requestIds = [];
        for (const request of requests) {
            const userIndex = users.findIndex(u => u.username === request.user);
            
            // Make sure the skill exists in skillIds
            if (!skillIds[request.skill]) {
                console.log(`  ⚠️ Warning: Skill "${request.skill}" not found, skipping...`);
                continue;
            }
            
            const [result] = await db.execute(
                'INSERT INTO requests (user_id, skill_id, description) VALUES (?, ?, ?)',
                [userIds[userIndex], skillIds[request.skill], request.description]
            );
            requestIds.push(result.insertId);
            console.log(`  ✓ Added request: ${request.user} wants to learn ${request.skill}`);
        }
        
        // ==================== MATCHES ====================
        console.log('\nCreating matches...');
        const matches = [
            { offerIndex: 0, requestIndex: 2, status: 'completed' }, // Alex offers JS <-> Maria wants JS
            { offerIndex: 2, requestIndex: 1, status: 'accepted' }, // Maria offers Guitar <-> Alex wants Guitar
            { offerIndex: 4, requestIndex: 17, status: 'pending' }, // John offers Tennis <-> ??
            { offerIndex: 6, requestIndex: 10, status: 'completed' }, // Sophie offers Digital Art <-> Emma wants UI/UX
            { offerIndex: 8, requestIndex: 18, status: 'pending' }, // David offers Japanese Cuisine <-> ??
            { offerIndex: 10, requestIndex: 8, status: 'accepted' }, // Emma offers Portrait Photography <-> David wants Portrait Photography
            { offerIndex: 12, requestIndex: 0, status: 'completed' }, // Carlos offers Spanish <-> Alex wants Spanish
            { offerIndex: 14, requestIndex: 4, status: 'pending' }, // Lisa offers Yoga <-> John wants Nutrition
            { offerIndex: 16, requestIndex: 6, status: 'pending' }, // Mike offers Stock Trading <-> Sophie wants Social Media Marketing
            { offerIndex: 18, requestIndex: 15, status: 'accepted' } // Nina offers Dance <-> Lisa wants Portrait Photography
        ];
        
        const matchIds = [];
        for (const match of matches) {
            // Make sure indices are valid
            if (match.offerIndex >= offerIds.length || match.requestIndex >= requestIds.length) {
                console.log(`  ⚠️ Warning: Match indices out of range, skipping...`);
                continue;
            }
            
            const [result] = await db.execute(
                'INSERT INTO matches (offer_id, request_id, status) VALUES (?, ?, ?)',
                [offerIds[match.offerIndex], requestIds[match.requestIndex], match.status]
            );
            matchIds.push(result.insertId);
            console.log(`  ✓ Created match: ${offers[match.offerIndex].user} offers ${offers[match.offerIndex].skill} <-> ${requests[match.requestIndex].user} wants ${requests[match.requestIndex].skill} (${match.status})`);
        }
        
        // ==================== REVIEWS ====================
        console.log('\nAdding reviews...');
        const reviews = [
            { matchIndex: 0, rating: 5, comment: 'Alex is an amazing teacher! Learned so much in just a few sessions.' },
            { matchIndex: 3, rating: 5, comment: 'Sophie helped me create a beautiful portfolio website. Highly recommended!' },
            { matchIndex: 6, rating: 4, comment: 'Great conversation practice. Carlos is patient and helpful.' },
            { matchIndex: 2, rating: 4, comment: 'Good session, looking forward to continuing.' },
            { matchIndex: 5, rating: 5, comment: 'Emma is a photography wizard! My photos have improved so much.' }
        ];
        
        for (const review of reviews) {
            if (review.matchIndex >= matchIds.length) {
                console.log(`  ⚠️ Warning: Review match index out of range, skipping...`);
                continue;
            }
            
            await db.execute(
                'INSERT INTO reviews (match_id, rating, comment) VALUES (?, ?, ?)',
                [matchIds[review.matchIndex], review.rating, review.comment]
            );
            console.log(`  ✓ Added review for match ${review.matchIndex + 1}`);
        }
        
        // ==================== AVAILABILITY ====================
        console.log('\nAdding availability slots...');
        const availabilities = [
            { user: 'alex_coder', day: 'Monday', start: '09:00:00', end: '17:00:00' },
            { user: 'alex_coder', day: 'Wednesday', start: '09:00:00', end: '17:00:00' },
            { user: 'alex_coder', day: 'Friday', start: '09:00:00', end: '17:00:00' },
            { user: 'maria_guitar', day: 'Tuesday', start: '14:00:00', end: '20:00:00' },
            { user: 'maria_guitar', day: 'Thursday', start: '14:00:00', end: '20:00:00' },
            { user: 'maria_guitar', day: 'Saturday', start: '10:00:00', end: '16:00:00' },
            { user: 'john_sports', day: 'Monday', start: '06:00:00', end: '12:00:00' },
            { user: 'john_sports', day: 'Wednesday', start: '06:00:00', end: '12:00:00' },
            { user: 'john_sports', day: 'Friday', start: '06:00:00', end: '12:00:00' },
            { user: 'sophie_art', day: 'Tuesday', start: '10:00:00', end: '18:00:00' },
            { user: 'sophie_art', day: 'Thursday', start: '10:00:00', end: '18:00:00' },
            { user: 'sophie_art', day: 'Sunday', start: '12:00:00', end: '16:00:00' }
        ];
        
        for (const avail of availabilities) {
            const userIndex = users.findIndex(u => u.username === avail.user);
            await db.execute(
                'INSERT INTO availability (user_id, day, start_time, end_time) VALUES (?, ?, ?, ?)',
                [userIds[userIndex], avail.day, avail.start, avail.end]
            );
            console.log(`  ✓ Added availability for ${avail.user} on ${avail.day}`);
        }
        
        // ==================== UPDATE REPUTATION SCORES ====================
        console.log('\nUpdating reputation scores...');
        
        // Calculate average ratings for users who received reviews
        for (let i = 0; i < userIds.length; i++) {
            const [reviews] = await db.execute(`
                SELECT AVG(r.rating) as avg_rating
                FROM reviews r
                JOIN matches m ON r.match_id = m.match_id
                JOIN offers o ON m.offer_id = o.offer_id
                WHERE o.user_id = ?
                UNION ALL
                SELECT AVG(r.rating)
                FROM reviews r
                JOIN matches m ON r.match_id = m.match_id
                JOIN requests req ON m.request_id = req.request_id
                WHERE req.user_id = ?
            `, [userIds[i], userIds[i]]);
            
            // Calculate average from the two queries
            let total = 0;
            let count = 0;
            for (const row of reviews) {
                if (row.avg_rating) {
                    total += parseFloat(row.avg_rating);
                    count++;
                }
            }
            
            const avgRating = count > 0 ? total / count : 0;
            
            await db.execute(
                'UPDATE users SET reputation_score = ? WHERE user_id = ?',
                [avgRating, userIds[i]]
            );
        }
        console.log('  ✓ Updated reputation scores');
        
        console.log('\n✅✅✅ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✅✅✅');
        console.log('\n📊 Summary:');
        console.log(`  • ${categories.length} categories`);
        console.log(`  • ${skills.length} skills`);
        console.log(`  • ${users.length} users`);
        console.log(`  • ${offers.length} offers`);
        console.log(`  • ${requests.length} requests`);
        console.log(`  • ${matches.length} matches`);
        console.log(`  • ${reviews.length} reviews`);
        console.log(`  • ${availabilities.length} availability slots`);
        
        console.log('\n🔐 Test Accounts:');
        console.log('  Email: alex@example.com | Password: Password123!');
        console.log('  Email: maria@example.com | Password: Password123!');
        console.log('  Email: john@example.com | Password: Password123!');
        console.log('  (All users have password: Password123!)');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit();
    }
}

// Run the seed function
seedDatabase();