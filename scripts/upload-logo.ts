import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadLogo() {
    try {
        const logoPath = path.join(process.cwd(), 'public', 'Logos', 'logo+name_transparent.png');
        const fileBuffer = fs.readFileSync(logoPath);

        // Create bucket if it doesn't exist
        const { data: buckets } = await supabase.storage.listBuckets();
        const logosBucketExists = buckets?.some(b => b.name === 'logos');

        if (!logosBucketExists) {
            const { error: bucketError } = await supabase.storage.createBucket('logos', {
                public: true,
                fileSizeLimit: 5242880, // 5MB
            });
            if (bucketError) {
                console.error('Error creating bucket:', bucketError);
                return;
            }
            console.log('Created logos bucket');
        }

        // Upload the logo
        const { data, error } = await supabase.storage
            .from('logos')
            .upload('logo+name_transparent.png', fileBuffer, {
                contentType: 'image/png',
                upsert: true,
            });

        if (error) {
            console.error('Error uploading logo:', error);
            return;
        }

        console.log('Logo uploaded successfully!');
        console.log('Public URL:', `${supabaseUrl}/storage/v1/object/public/logos/logo+name_transparent.png`);
    } catch (error) {
        console.error('Upload error:', error);
    }
}

uploadLogo();
