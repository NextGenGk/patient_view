const dns = require('dns');

const domain = 'rsnysvtjmelnojkubdqu.supabase.co';

console.log(`Attempting to resolve ${domain}...`);

dns.lookup(domain, (err, address, family) => {
    if (err) {
        console.error('DNS Lookup failed:', err);
    } else {
        console.log('DNS Lookup successful:', address, 'Family:', family);
    }
});

console.log('Attempting fetch...');
fetch(`https://${domain}`)
    .then(res => console.log('Fetch successful, status:', res.status))
    .catch(err => console.error('Fetch failed:', err));
