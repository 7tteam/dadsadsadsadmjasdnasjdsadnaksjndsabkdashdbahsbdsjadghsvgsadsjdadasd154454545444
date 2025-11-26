const domainPricing = {
    '.com': { register: 10.99, renew: 10.99, transfer: 10.99 },
    '.net': { register: 12.99, renew: 12.99, transfer: 12.99 },
    '.org': { register: 12.99, renew: 12.99, transfer: 12.99 },
    '.info': { register: 3.99, renew: 18.99, transfer: 18.99 },
    '.co': { register: 29.99, renew: 29.99, transfer: 29.99 },
    '.us': { register: 8.99, renew: 8.99, transfer: 8.99 },
    '.biz': { register: 17.99, renew: 17.99, transfer: 17.99 },
    '.co.uk': { register: 8.99, renew: 8.99, transfer: 8.99 },
    '.io': { register: 39.99, renew: 39.99, transfer: 39.99 },
    '.tech': { register: 6.99, renew: 49.99, transfer: 49.99 },
    '.love': { register: 4.99, renew: 29.99, transfer: 29.99 },
    '.tv': { register: 34.99, renew: 34.99, transfer: 34.99 },
    '.me': { register: 19.99, renew: 19.99, transfer: 19.99 },
    '.store': { register: 4.99, renew: 59.99, transfer: 59.99 },
    '.online': { register: 3.99, renew: 39.99, transfer: 39.99 },
    '.app': { register: 14.99, renew: 14.99, transfer: 14.99 },
    '.dev': { register: 12.99, renew: 12.99, transfer: 12.99 },
    '.ai': { register: 89.99, renew: 89.99, transfer: 89.99 },
    '.xyz': { register: 1.99, renew: 12.99, transfer: 12.99 },
    '.site': { register: 2.99, renew: 29.99, transfer: 29.99 },
    '.blog': { register: 29.99, renew: 29.99, transfer: 29.99 },
    '.shop': { register: 3.99, renew: 38.99, transfer: 38.99 },
    '.cloud': { register: 6.99, renew: 24.99, transfer: 24.99 },
    '.digital': { register: 3.99, renew: 33.99, transfer: 33.99 },
    '.agency': { register: 22.99, renew: 22.99, transfer: 22.99 },
    '.studio': { register: 26.99, renew: 26.99, transfer: 26.99 },
    '.design': { register: 49.99, renew: 49.99, transfer: 49.99 },
    '.solutions': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.services': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.network': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.company': { register: 9.99, renew: 9.99, transfer: 9.99 },
    '.business': { register: 9.99, renew: 9.99, transfer: 9.99 },
    '.consulting': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.marketing': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.media': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.photography': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.academy': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.education': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.institute': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.university': { register: 49.99, renew: 49.99, transfer: 49.99 },
    '.school': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.center': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.clinic': { register: 49.99, renew: 49.99, transfer: 49.99 },
    '.dental': { register: 49.99, renew: 49.99, transfer: 49.99 },
    '.care': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.health': { register: 79.99, renew: 79.99, transfer: 79.99 },
    '.fitness': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.life': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.world': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.global': { register: 79.99, renew: 79.99, transfer: 79.99 },
    '.international': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.group': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.team': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.club': { register: 13.99, renew: 13.99, transfer: 13.99 },
    '.pro': { register: 18.99, renew: 18.99, transfer: 18.99 },
    '.expert': { register: 54.99, renew: 54.99, transfer: 54.99 },
    '.guru': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.ninja': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.zone': { register: 33.99, renew: 33.99, transfer: 33.99 },
    '.space': { register: 2.99, renew: 24.99, transfer: 24.99 },
    '.fun': { register: 2.99, renew: 24.99, transfer: 24.99 },
    '.games': { register: 21.99, renew: 21.99, transfer: 21.99 },
    '.casino': { register: 159.99, renew: 159.99, transfer: 159.99 },
    '.bet': { register: 18.99, renew: 18.99, transfer: 18.99 },
    '.poker': { register: 54.99, renew: 54.99, transfer: 54.99 },
    '.news': { register: 26.99, renew: 26.99, transfer: 26.99 },
    '.today': { register: 23.99, renew: 23.99, transfer: 23.99 },
    '.live': { register: 26.99, renew: 26.99, transfer: 26.99 }
};

async function checkDomainAvailability(domain) {
    try {
        // Using WHOIS lookup via CORS proxy
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_free&domainName=' + domain + '&outputFormat=JSON')}`);
        const data = await response.json();
        
        // Check if domain is registered
        if (data.WhoisRecord && data.WhoisRecord.registryData) {
            return false; // Domain is taken
        }
        
        return true; // Domain is available
    } catch (error) {
        console.error('WHOIS check failed:', error);
        // Fallback: check via DNS
        try {
            const dnsCheck = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
            const dnsData = await dnsCheck.json();
            return dnsData.Status === 3; // NXDOMAIN means available
        } catch (e) {
            console.error('DNS check failed:', e);
            return null; // Unknown status
        }
    }
}

function generateAISuggestions(baseName) {
    const prefixes = ['get', 'my', 'the', 'try', 'use', 'go', 'new', 'pro', 'best', 'top'];
    const suffixes = ['app', 'hub', 'lab', 'zone', 'spot', 'pro', 'now', 'online', 'web', 'site'];
    const suggestions = [];
    
    suggestions.push(baseName);
    suggestions.push(baseName + Math.floor(Math.random() * 999));
    suggestions.push(prefixes[Math.floor(Math.random() * prefixes.length)] + baseName);
    suggestions.push(baseName + suffixes[Math.floor(Math.random() * suffixes.length)]);
    suggestions.push(baseName.replace(/[aeiou]/g, ''));
    
    return [...new Set(suggestions)].slice(0, 5);
}

async function checkDomain(event) {
    event.preventDefault();

    const domainBase = document.getElementById('domain-name').value.trim();
    const domainExt = document.getElementById('select').value;
    
    if (!domainBase) {
        alert('Please enter a domain name');
        return;
    }

    const loading = document.getElementById('loading');
    const resultTable = document.getElementById('domain-results');
    const suggestionsDiv = document.getElementById('ai-suggestions');
    
    resultTable.innerHTML = '';
    loading.style.display = 'block';

    const suggestions = generateAISuggestions(domainBase);
    if (suggestionsDiv) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
    }

    const extensions = Object.keys(domainPricing);
    const selectedExtensions = [domainExt, ...extensions.filter(ext => ext !== domainExt)];

    const results = await Promise.all(
        selectedExtensions.map(async (ext) => {
            const fullDomain = domainBase + ext;
            const available = await checkDomainAvailability(fullDomain);
            const pricing = domainPricing[ext] || { register: 9.99, renew: 17.99, transfer: 7.99 };
            
            return {
                domain: fullDomain,
                available: available,
                pricing: pricing
            };
        })
    );

    loading.style.display = 'none';

    // Show AI suggestions after first result
    let firstAvailable = results.find(r => r.available);
    if (suggestionsDiv && firstAvailable) {
        const suggestions = generateAISuggestions(domainBase);
        suggestionsDiv.innerHTML = `
            <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#667eea" stroke-width="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    <h4 style="margin: 0; font-size: 16px; color: #2d3748; font-weight: 600;">AI Suggestions</h4>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${suggestions.map(s => `
                        <button onclick="document.getElementById('domain-name').value='${s}'; checkDomain(event);" 
                            style="padding: 8px 16px; background: white; border: 1px solid #e2e8f0; border-radius: 6px; color: #4a5568; cursor: pointer; transition: all 0.2s; font-size: 14px; font-weight: 500;"
                            onmouseover="this.style.borderColor='#667eea'; this.style.color='#667eea'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 2px 4px rgba(0,0,0,0.1)'"
                            onmouseout="this.style.borderColor='#e2e8f0'; this.style.color='#4a5568'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                            ${s}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        suggestionsDiv.style.display = 'block';
    }

    results.forEach(result => {
        const row = document.createElement('tr');
        let statusBadge = '';
        
        if (result.available === null) {
            statusBadge = `<span style="color:#ffa502; font-weight: bold;">⚠️ Unknown</span>`;
        } else if (result.available) {
            statusBadge = `<a href="https://pro.nutro.cloud/checkout/?pay=domain:${result.domain}" style="display: inline-block; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 25px; font-weight: bold; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.6)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'">✅ Available - Buy Now</a>`;
        } else {
            statusBadge = `<span style="color:#ff4757; font-weight: bold;">❌ Taken</span>`;
        }
        
        row.innerHTML = `
            <td class="package"><strong>${result.domain}</strong></td>
            <td class="process">$${result.pricing.register}</td>
            <td class="ram">$${result.pricing.renew}</td>
            <td class="storage">$${result.pricing.transfer}</td>
            <td>${statusBadge}</td>
        `;
        resultTable.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadDomainSelect();
    loadPricingTables();
    loadPopularDomains();
    loadAllDomainsTable();
});

function loadDomainSelect() {
    const select = document.getElementById('select');
    if (!select) return;
    
    const popularFirst = ['.com', '.net', '.org', '.io', '.ai', '.app', '.dev', '.tech', '.xyz', '.online'];
    const allDomains = Object.keys(domainPricing);
    
    // Add popular domains first
    popularFirst.forEach(ext => {
        if (domainPricing[ext]) {
            const option = document.createElement('option');
            option.value = ext;
            option.textContent = `${ext} - $${domainPricing[ext].register}`;
            select.appendChild(option);
        }
    });
    
    // Add separator
    const separator = document.createElement('option');
    separator.disabled = true;
    separator.textContent = '──────────';
    select.appendChild(separator);
    
    // Add remaining domains
    allDomains.forEach(ext => {
        if (!popularFirst.includes(ext)) {
            const option = document.createElement('option');
            option.value = ext;
            option.textContent = `${ext} - $${domainPricing[ext].register}`;
            select.appendChild(option);
        }
    });
}

function loadPricingTables() {
    const tables = document.querySelectorAll('.tab__content .table__content');
    
    tables.forEach(table => {
        table.innerHTML = '';
        
        Object.entries(domainPricing).forEach(([ext, prices]) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="package">${ext}</td>
                <td class="process">$${prices.register}</td>
                <td class="ram">$${prices.renew}</td>
                <td class="storage">$${prices.transfer}</td>
            `;
            table.appendChild(row);
        });
    });
}

function loadPopularDomains() {
    const popularExts = ['.com', '.net', '.org', '.io', '.ai', '.app', '.dev', '.tech'];
    const images = ['domain-01.svg', 'domain-02.svg', 'domain-03.svg', 'domain-04.svg', 'domain-05.svg', 'domain-06.svg', 'domain-07.svg', 'domain-08.svg'];
    const container = document.getElementById('popular-domains');
    
    if (!container) return;
    
    popularExts.forEach((ext, index) => {
        const pricing = domainPricing[ext];
        if (pricing) {
            container.innerHTML += `
                <div class="col-lg-3 col-md-4 col-sm-6" data-sal="slide-down" data-sal-delay="${200 + (index * 100)}" data-sal-duration="800">
                    <div class="pricing-wrapper">
                        <div class="logo"><img src="assets/images/pricing/${images[index]}" alt="${ext}"></div>
                        <div class="content">
                            <p class="desc">Register your ${ext} domain today</p>
                            <div class="price-area">
                                <span class="now">$${pricing.register}</span>
                                <span class="period">/year</span>
                            </div>
                            <div class="button-area">
                                <a href="#" onclick="document.getElementById('domain-name').value='example'; document.getElementById('select').value='${ext}'; document.querySelector('form').scrollIntoView({behavior: 'smooth'}); return false;" class="pricing-btn rts-btn">Search</a>
                                <a href="https://pro.nutro.cloud/checkout/?pay=domain:example${ext}" class="pricing-btn rts-btn border">Register</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

function loadAllDomainsTable() {
    const table = document.getElementById('all-domains-table');
    if (!table) return;
    
    Object.entries(domainPricing).forEach(([ext, prices]) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="package"><strong>${ext}</strong></td>
            <td class="process">$${prices.register}</td>
            <td class="ram">$${prices.renew}</td>
            <td class="storage">$${prices.transfer}</td>
        `;
        table.appendChild(row);
    });
}
