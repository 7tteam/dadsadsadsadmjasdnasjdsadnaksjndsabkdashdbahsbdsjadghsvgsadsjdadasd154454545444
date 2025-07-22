// Minimal fix for plans loading
document.addEventListener('DOMContentLoaded', function() {
  // Load VPS plans
  loadVPSPlans();
  
  // Load other plans
  loadWordPressPlans();
  loadSharedPlans();
  loadS3Plans();
  loadNodeJSPlans();
  loadGPUPlans();
  loadDeepSeekPlans();
});

function loadVPSPlans() {
  const tableBody = document.getElementById("vps-plans-table");
  if (!tableBody) return;
  
  fetch("https://user.7tteam.com/admin/nutrocloud/plan.php")
    .then(res => res.json())
    .catch(() => [])
    .then(plans => {
      if (!plans || !plans.length) {
        tableBody.innerHTML = "<tr><td colspan='7'>No VPS plans available</td></tr>";
        return;
      }
      
      tableBody.innerHTML = '';
      plans.forEach(plan => {
        let cpu = "N/A", ram = "N/A", storage = "N/A", bandwidth = "N/A";
        
        if (plan.features) {
          plan.features.forEach(feature => {
            if (feature.includes("CPU") || feature.includes("Core")) cpu = feature;
            if (feature.includes("RAM") || feature.includes("Memory")) ram = feature;
            if (feature.includes("SSD") || feature.includes("Storage") || feature.includes("Disk")) storage = feature;
            if (feature.includes("Bandwidth") || feature.includes("Traffic")) bandwidth = feature;
          });
        }
        
        const row = document.createElement('tr');
        const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
        
        row.innerHTML = '<td style="' + isPopular + '">' +
          '<strong>' + plan.name + '</strong>' +
          (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
          '<br><small>' + plan.desc + '</small>' +
          '</td>' +
          '<td>' + cpu + '</td>' +
          '<td>' + ram + '</td>' +
          '<td>' + storage + '</td>' +
          '<td>' + bandwidth + '</td>' +
          '<td>' +
          '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
          '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
          '</td>' +
          '<td>' +
          '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
          '</td>';
        
        tableBody.appendChild(row);
      });
    });
}

function loadWordPressPlans() {
  const tableBody = document.getElementById("wordpress-plans-table");
  if (!tableBody) return;
  
  fetch("https://user.7tteam.com/admin/nutrocloud/wpplan.php")
    .then(res => res.json())
    .catch(() => [])
    .then(plans => {
      if (!plans || !plans.length) {
        tableBody.innerHTML = "<tr><td colspan='6'>No WordPress plans available</td></tr>";
        return;
      }
      
      tableBody.innerHTML = '';
      plans.forEach(plan => {
        let websites = "1 Website", storage = "N/A", performance = "Standard";
        
        if (plan.features) {
          plan.features.forEach(feature => {
            if (feature.includes("Website") || feature.includes("Sites")) websites = feature;
            if (feature.includes("SSD") || feature.includes("Storage") || feature.includes("Disk")) storage = feature;
            if (feature.includes("Speed") || feature.includes("Performance") || feature.includes("Fast")) performance = feature;
          });
        }
        
        const row = document.createElement('tr');
        const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
        
        row.innerHTML = '<td style="' + isPopular + '">' +
          '<strong>' + plan.name + '</strong>' +
          (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
          '<br><small>' + plan.desc + '</small>' +
          '</td>' +
          '<td>' + websites + '</td>' +
          '<td>' + storage + '</td>' +
          '<td>' + performance + '</td>' +
          '<td>' +
          '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
          '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
          '</td>' +
          '<td>' +
          '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
          '</td>';
        
        tableBody.appendChild(row);
      });
    });
}

function loadSharedPlans() {
  const tableBody = document.getElementById("shared-plans-table");
  if (!tableBody) return;
  
  fetch("https://user.7tteam.com/admin/nutrocloud/wplane.php")
    .then(res => res.json())
    .catch(() => [])
    .then(plans => {
      if (!plans || !plans.length) {
        tableBody.innerHTML = "<tr><td colspan='7'>No Shared Web Hosting plans available</td></tr>";
        return;
      }
      
      tableBody.innerHTML = '';
      plans.forEach(plan => {
        let storage = "N/A", bandwidth = "N/A", email = "N/A", databases = "N/A";
        
        if (plan.features) {
          plan.features.forEach(feature => {
            if (feature.includes("SSD") || feature.includes("Storage") || feature.includes("Disk")) storage = feature;
            if (feature.includes("Bandwidth") || feature.includes("Traffic")) bandwidth = feature;
            if (feature.includes("Email") || feature.includes("Mail")) email = feature;
            if (feature.includes("Database") || feature.includes("MySQL")) databases = feature;
          });
        }
        
        const row = document.createElement('tr');
        const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
        
        row.innerHTML = '<td style="' + isPopular + '">' +
          '<strong>' + plan.name + '</strong>' +
          (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
          '<br><small>' + plan.desc + '</small>' +
          '</td>' +
          '<td>' + storage + '</td>' +
          '<td>' + bandwidth + '</td>' +
          '<td>' + email + '</td>' +
          '<td>' + databases + '</td>' +
          '<td>' +
          '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
          '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
          '</td>' +
          '<td>' +
          '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
          '</td>';
        
        tableBody.appendChild(row);
      });
    });
}

function loadS3Plans() {
  // Load English plans
  const tableBodyEn = document.getElementById("s3-plans-table-en");
  const tableBodyAr = document.getElementById("s3-plans-table-ar");
  if (!tableBodyEn && !tableBodyAr) return;
  
  // S3 plans data
  const s3Plans = [
    {
      name: "S3 Lite",
      desc: "Perfect for beginners and personal storage",
      storage: "230 GB SSD Storage",
      security: "Basic Security",
      performance: "Fast I/O",
      price: "0.99",
      renew_price: "1.99",
      link: "https://pro.nutro.cloud/checkout.php?package=server1mo",
      popular: false
    },
    {
      name: "S3 Secure",
      desc: "For developers & teams with enhanced security",
      storage: "500 GB SSD Storage",
      security: "DDoS Protection, Multi-user Access",
      performance: "High I/O",
      price: "3.49",
      renew_price: "5.99",
      link: "https://pro.nutro.cloud/checkout.php?package=server2mo",
      popular: true
    },
    {
      name: "S3 Turbo",
      desc: "High speed performance for demanding applications",
      storage: "1 TB SSD Storage",
      security: "Advanced Security, Auto Backup",
      performance: "Ultra Fast I/O",
      price: "14.99",
      renew_price: "25.00",
      link: "https://pro.nutro.cloud/checkout.php?package=server3mo",
      popular: false
    },
    {
      name: "S3 MaxVault",
      desc: "Enterprise-grade storage for professionals",
      storage: "5 TB NVMe Storage",
      security: "Enterprise Security, Unlimited Traffic",
      performance: "Ultra Fast NVMe",
      price: "29.99",
      renew_price: "60.00",
      link: "https://pro.nutro.cloud/checkout.php?package=server4mo",
      popular: false
    }
  ];
  
  // Populate English table
  if (tableBodyEn) {
    tableBodyEn.innerHTML = '';
    s3Plans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' + plan.security + '</td>' +
        '<td>' + plan.performance + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
        '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
        '</td>';
      
      tableBodyEn.appendChild(row);
    });
  }
  
  // Populate Arabic table
  if (tableBodyAr) {
    tableBodyAr.innerHTML = '';
    s3Plans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">مميز</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' + plan.security + '</td>' +
        '<td>' + plan.performance + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/شهر' +
        '<br><small>يتجدد بسعر $' + plan.renew_price + '/شهر</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">اختيار</a>' +
        '</td>';
      
      tableBodyAr.appendChild(row);
    });
  }
}

function loadNodeJSPlans() {
  const tableBodyEn = document.getElementById("nodejs-plans-table-en");
  const tableBodyAr = document.getElementById("nodejs-plans-table-ar");
  if (!tableBodyEn && !tableBodyAr) return;
  
  // NodeJS plans data
  const nodejsPlans = [
    {
      name: "Node Starter",
      desc: "Perfect for beginners and small projects",
      ram: "512MB RAM",
      storage: "10GB SSD",
      bandwidth: "1TB Bandwidth",
      price: "3.00",
      renew_price: "5.99",
      link: "#",
      popular: false
    },
    {
      name: "Node Pro",
      desc: "For production applications and APIs",
      ram: "2GB RAM",
      storage: "25GB SSD",
      bandwidth: "3TB Bandwidth",
      price: "8.99",
      renew_price: "12.99",
      link: "#",
      popular: true
    },
    {
      name: "Node Business",
      desc: "For growing businesses and high-traffic apps",
      ram: "4GB RAM",
      storage: "50GB SSD",
      bandwidth: "5TB Bandwidth",
      price: "16.99",
      renew_price: "24.99",
      link: "#",
      popular: false
    },
    {
      name: "Node Enterprise",
      desc: "For large-scale applications and enterprises",
      ram: "8GB RAM",
      storage: "100GB SSD",
      bandwidth: "10TB Bandwidth",
      price: "29.99",
      renew_price: "39.99",
      link: "#",
      popular: false
    }
  ];
  
  // Populate English table
  if (tableBodyEn) {
    tableBodyEn.innerHTML = '';
    nodejsPlans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.ram + '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' + plan.bandwidth + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
        '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
        '</td>';
      
      tableBodyEn.appendChild(row);
    });
  }
  
  // Populate Arabic table
  if (tableBodyAr) {
    tableBodyAr.innerHTML = '';
    nodejsPlans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">مميز</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.ram + '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' + plan.bandwidth + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/شهر' +
        '<br><small>يتجدد بسعر $' + plan.renew_price + '/شهر</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">اختيار</a>' +
        '</td>';
      
      tableBodyAr.appendChild(row);
    });
  }
}

function loadGPUPlans() {
  const tableBodyEn = document.getElementById("gpu-plans-table-en");
  const tableBodyAr = document.getElementById("gpu-plans-table-ar");
  if (!tableBodyEn && !tableBodyAr) return;
  
  // GPU plans data
  const gpuPlans = [
    {
      name: "GPU Starter",
      desc: "For ML beginners and small projects",
      gpu: "NVIDIA T4 (16GB VRAM)",
      ram: "32GB RAM",
      storage: "150GB NVMe SSD",
      price: "90.00",
      renew_price: "105.99",
      link: "#",
      popular: false
    },
    {
      name: "GPU Pro",
      desc: "For serious ML projects and research",
      gpu: "NVIDIA RTX A4000 (16GB GDDR6)",
      ram: "64GB RAM",
      storage: "300GB NVMe SSD",
      price: "169.99",
      renew_price: "199.99",
      link: "#",
      popular: true
    },
    {
      name: "GPU Enterprise",
      desc: "For production AI and deep learning",
      gpu: "NVIDIA A100 (40GB HBM2)",
      ram: "128GB RAM",
      storage: "500GB NVMe SSD",
      price: "424.99",
      renew_price: "499.99",
      link: "#",
      popular: false
    },
    {
      name: "GPU Ultimate",
      desc: "For large-scale AI training and inference",
      gpu: "2x NVIDIA A100 (2x 40GB HBM2)",
      ram: "256GB RAM",
      storage: "1TB NVMe SSD",
      price: "849.99",
      renew_price: "999.99",
      link: "#",
      popular: false
    }
  ];
  
  // Populate English table
  if (tableBodyEn) {
    tableBodyEn.innerHTML = '';
    gpuPlans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.gpu + '</td>' +
        '<td>' + plan.ram + '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
        '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
        '</td>';
      
      tableBodyEn.appendChild(row);
    });
  }
  
  // Populate Arabic table
  if (tableBodyAr) {
    tableBodyAr.innerHTML = '';
    gpuPlans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">مميز</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.gpu + '</td>' +
        '<td>' + plan.ram + '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/شهر' +
        '<br><small>يتجدد بسعر $' + plan.renew_price + '/شهر</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">اختيار</a>' +
        '</td>';
      
      tableBodyAr.appendChild(row);
    });
  }
}

function loadDeepSeekPlans() {
  const tableBodyEn = document.getElementById("deepseek-plans-table-en");
  const tableBodyAr = document.getElementById("deepseek-plans-table-ar");
  if (!tableBodyEn && !tableBodyAr) return;
  
  // DeepSeeK plans data
  const deepseekPlans = [
    {
      name: "Starter Nova",
      desc: "For light apps & basic AI models",
      cpu: "4 vCPUs",
      ram: "16GB RAM",
      storage: "100GB SSD",
      price: "92.10",
      renew_price: "97.10",
      link: "#",
      popular: false
    },
    {
      name: "Power Core",
      desc: "Balanced for moderate AI & dev workloads",
      cpu: "8 vCPUs",
      ram: "32GB RAM",
      storage: "250GB SSD",
      price: "133.75",
      renew_price: "138.75",
      link: "#",
      popular: true
    },
    {
      name: "Titan Boost",
      desc: "Advanced ML, APIs, and multitasking tools",
      cpu: "16 vCPUs",
      ram: "64GB RAM",
      storage: "500GB SSD",
      price: "174.21",
      renew_price: "179.21",
      link: "#",
      popular: false
    },
    {
      name: "Ultra Neural",
      desc: "For high-demand AI engines & deep inference",
      cpu: "32 vCPUs",
      ram: "128GB RAM",
      storage: "1TB NVMe SSD",
      price: "242.04",
      renew_price: "247.04",
      link: "#",
      popular: false
    }
  ];
  
  // Populate English table
  if (tableBodyEn) {
    tableBodyEn.innerHTML = '';
    deepseekPlans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">Popular</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.cpu + '</td>' +
        '<td>' + plan.ram + '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/mo' +
        '<br><small>Renews at $' + plan.renew_price + '/mo</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">Select</a>' +
        '</td>';
      
      tableBodyEn.appendChild(row);
    });
  }
  
  // Populate Arabic table
  if (tableBodyAr) {
    tableBodyAr.innerHTML = '';
    deepseekPlans.forEach(plan => {
      const row = document.createElement('tr');
      const isPopular = plan.popular ? 'background-color: #f0f9ff; border-left: 4px solid #3b82f6;' : '';
      
      row.innerHTML = '<td style="' + isPopular + '">' +
        '<strong>' + plan.name + '</strong>' +
        (plan.popular ? '<span class="badge bg-primary ms-2">مميز</span>' : '') +
        '<br><small>' + plan.desc + '</small>' +
        '</td>' +
        '<td>' + plan.cpu + '</td>' +
        '<td>' + plan.ram + '</td>' +
        '<td>' + plan.storage + '</td>' +
        '<td>' +
        '<strong style="font-size: 18px; color: #10b981;">$' + plan.price + '</strong>/شهر' +
        '<br><small>يتجدد بسعر $' + plan.renew_price + '/شهر</small>' +
        '</td>' +
        '<td>' +
        '<a href="' + plan.link + '" class="btn btn-primary">اختيار</a>' +
        '</td>';
      
      tableBodyAr.appendChild(row);
    });
  }
}