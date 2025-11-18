// Test with a real URL
const testUrl = "";

// Example 1: Simple fetch request to check if page loads
async function checkPageLoads(url) {
  try {
    const response = await fetch(url);

    if (response.ok) {
      const content = await response.text();
      console.log("✓ Page loaded successfully");
      console.log(`Status: ${response.status}`);
      console.log(`Content length: ${content.length} characters`);
      return { success: true, content, status: response.status };
    } else {
      console.log("✗ Page failed to load");
      console.log(`Status: ${response.status}`);
      return { success: false, status: response.status };
    }
  } catch (error) {
    console.error("✗ Error loading page:", error.message);
    return { success: false, error: error.message };
  }
}

// Example 2: Check if specific content exists on the page
async function checkSpecificContent(url, expectedText) {
  try {
    const response = await fetch(url);
    const content = await response.text();

    const contentExists = content.includes(expectedText);

    if (contentExists) {
      console.log(`✓ Found expected content: "${expectedText}"`);
    } else {
      console.log(`✗ Expected content not found: "${expectedText}"`);
    }

    return { success: response.ok, contentExists };
  } catch (error) {
    console.error("✗ Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Example 3: Check if page loads with timeout
async function checkPageWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    const content = await response.text();
    console.log(`✓ Page loaded within ${timeoutMs}ms`);
    return { success: true, content, loadTime: "within timeout" };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      console.log(`✗ Page took longer than ${timeoutMs}ms to load`);
      return { success: false, error: "timeout" };
    }

    console.error("✗ Error:", error.message);
    return { success: false, error: error.message };
  }
}

// Example usage
async function main() {
  console.log("=== Testing page load ===\n");

  console.log("1. Basic page load check:");
  await checkPageLoads(testUrl);

  console.log("\n2. Check for specific content:");
  await checkSpecificContent(testUrl, `"fullStateName"`);

  console.log("\n3. Check with timeout:");
  await checkPageWithTimeout(testUrl, 5000);
}

// Export functions
module.exports = {
  checkPageLoads,
  checkSpecificContent,
  checkPageWithTimeout,
};

// Run if executed directly
if (require.main === module) {
  main();
}
