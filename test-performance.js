const puppeteer = require('puppeteer');

async function testProductPagePerformance() {
  console.log('🚀 Testing Product Page Performance...\n');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Enable performance monitoring
    await page.setCacheEnabled(false); // Disable cache for accurate testing
    
    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    
    console.log('📱 Testing Mobile Performance...');
    
    // Test mobile performance
    await page.setViewport({ width: 375, height: 667 });
    
    const mobileStartTime = Date.now();
    await page.goto('http://localhost:3000/products/mattresses/test-product-id', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    const mobileLoadTime = Date.now() - mobileStartTime;
    
    // Get performance metrics
    const mobileMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    console.log(`📱 Mobile Load Time: ${mobileLoadTime}ms`);
    console.log(`📱 DOM Content Loaded: ${mobileMetrics.domContentLoaded}ms`);
    console.log(`📱 First Paint: ${mobileMetrics.firstPaint}ms`);
    console.log(`📱 First Contentful Paint: ${mobileMetrics.firstContentfulPaint}ms`);
    
    console.log('\n💻 Testing Desktop Performance...');
    
    // Test desktop performance
    await page.setViewport({ width: 1280, height: 720 });
    
    const desktopStartTime = Date.now();
    await page.goto('http://localhost:3000/products/mattresses/test-product-id', {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    const desktopLoadTime = Date.now() - desktopStartTime;
    
    // Get performance metrics
    const desktopMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
      };
    });
    
    console.log(`💻 Desktop Load Time: ${desktopLoadTime}ms`);
    console.log(`💻 DOM Content Loaded: ${desktopMetrics.domContentLoaded}ms`);
    console.log(`💻 First Paint: ${desktopMetrics.firstPaint}ms`);
    console.log(`💻 First Contentful Paint: ${desktopMetrics.firstContentfulPaint}ms`);
    
    // Performance analysis
    console.log('\n📊 Performance Analysis:');
    
    const mobileScore = calculatePerformanceScore(mobileLoadTime, mobileMetrics);
    const desktopScore = calculatePerformanceScore(desktopLoadTime, desktopMetrics);
    
    console.log(`📱 Mobile Performance Score: ${mobileScore}/100`);
    console.log(`💻 Desktop Performance Score: ${desktopScore}/100`);
    
    // Recommendations
    console.log('\n💡 Performance Recommendations:');
    
    if (mobileLoadTime > 3000) {
      console.log('⚠️  Mobile load time is too slow (>3s). Consider:');
      console.log('   - Implementing lazy loading');
      console.log('   - Optimizing images');
      console.log('   - Reducing bundle size');
    }
    
    if (desktopLoadTime > 2000) {
      console.log('⚠️  Desktop load time is too slow (>2s). Consider:');
      console.log('   - Database query optimization');
      console.log('   - Component splitting');
      console.log('   - Better caching strategy');
    }
    
    if (mobileMetrics.firstContentfulPaint > 1500) {
      console.log('⚠️  First Contentful Paint is slow. Consider:');
      console.log('   - Critical CSS inlining');
      console.log('   - Reducing render-blocking resources');
      console.log('   - Optimizing above-the-fold content');
    }
    
    console.log('\n✅ Performance test completed!');
    
  } catch (error) {
    console.error('❌ Error during performance test:', error.message);
    console.log('\n💡 Make sure your development server is running on localhost:3000');
    console.log('💡 Update the test URL to match an actual product page');
  } finally {
    await browser.close();
  }
}

function calculatePerformanceScore(loadTime, metrics) {
  let score = 100;
  
  // Deduct points for slow loading
  if (loadTime > 5000) score -= 40;
  else if (loadTime > 3000) score -= 25;
  else if (loadTime > 2000) score -= 15;
  else if (loadTime > 1000) score -= 5;
  
  // Deduct points for slow FCP
  if (metrics.firstContentfulPaint > 2000) score -= 30;
  else if (metrics.firstContentfulPaint > 1500) score -= 20;
  else if (metrics.firstContentfulPaint > 1000) score -= 10;
  
  // Deduct points for slow DOM content loaded
  if (metrics.domContentLoaded > 3000) score -= 20;
  else if (metrics.domContentLoaded > 2000) score -= 10;
  
  return Math.max(0, score);
}

// Run the test
testProductPagePerformance().catch(console.error);
