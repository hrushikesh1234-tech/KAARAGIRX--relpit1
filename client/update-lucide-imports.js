import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// List of files to update
const files = [
  'src/pages/shop/TrackOrder2S.tsx',
  'src/pages/shop/TrackOrder-toolbar2S.tsx',
  'src/pages/shop/Shop2S.tsx',
  'src/pages/shop/OrderDetailsPage2S.tsx',
  'src/pages/shop/LikedItems2S.tsx',
  'src/pages/shop/Index2S.tsx',
  'src/pages/shop/DealerListing2S.tsx',
  'src/pages/shop/Cart2S.tsx',
  'src/pages/shop/BuyNowRequest2S.tsx',
  'src/pages/PortfolioAlbumPage.tsx',
  'src/pages/dashboard/Projects.tsx',
  'src/components/ui/accordion.tsx',
  'src/components/ui/breadcrumb.tsx',
  'src/components/ui/calendar.tsx',
  'src/components/ui/carousel.tsx',
  'src/components/ui/checkbox.tsx',
  'src/components/ui/command.tsx',
  'src/components/ui/context-menu.tsx',
  'src/components/ui/dialog.tsx',
  'src/components/ui/input-otp.tsx',
  'src/components/ui/menubar.tsx',
  'src/components/ui/navigation-menu.tsx',
  'src/components/ui/pagination.tsx',
  'src/components/ui/radio-group.tsx',
  'src/components/ui/Rating.tsx',
  'src/components/ui/resizable.tsx',
  'src/components/ui/select.tsx',
  'src/components/ui/sheet.tsx',
  'src/components/ui/sidebar.tsx',
  'src/components/ui/toast.tsx',
  'src/components/ProfessionalCard.tsx',
  'src/components/professionals/ProfessionalCard.tsx',
  'src/components/OrderRequestModal2S.tsx',
  'src/components/dealers/SubcategoryFilter.tsx'
];

// Process each file
files.forEach(filePath => {
  const fullPath = join(process.cwd(), filePath);
  
  try {
    if (existsSync(fullPath)) {
      let content = readFileSync(fullPath, 'utf8');
      
      // Pattern to match: const { ... } = require('lucide-react');
      const requirePattern = /const\s*{([^}]+)}\s*=\s*require\s*\(\s*['"]lucide-react['"]\s*\)\s*;?/g;
      
      // Check if the file contains the pattern
      if (requirePattern.test(content)) {
        // Reset lastIndex since we used the global flag
        requirePattern.lastIndex = 0;
        
        // Extract the icons
        const match = requirePattern.exec(content);
        if (match) {
          const icons = match[1].split(',').map(i => i.trim()).filter(Boolean);
          
          // Create the new import statement
          const newImport = `import { ${icons.join(', ')} } from 'lucide-react';`;
          
          // Replace the require statement with the import
          content = content.replace(requirePattern, newImport);
          
          // Write the updated content back to the file
          writeFileSync(fullPath, content, 'utf8');
          console.log(`✅ Updated ${filePath}`);
        }
      } else {
        console.log(`ℹ️  No require('lucide-react') found in ${filePath}`);
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\n🎉 All files have been processed!');
