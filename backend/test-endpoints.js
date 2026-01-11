/**
 * Quick Endpoint Testing Script
 * Run with: node test-endpoints.js
 * Make sure server is running on port 3001
 */

const API_BASE = 'http://localhost:3001/api';

async function testEndpoint(method, url, body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`✅ ${method} ${url}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));
    console.log('');
    
    return data;
  } catch (error) {
    console.error(`❌ ${method} ${url}`);
    console.error(`   Error:`, error.message);
    console.log('');
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  // Test 1: Health Check
  console.log('📡 Test 1: Health Check');
  await testEndpoint('GET', 'http://localhost:3001/');
  
  // Test 2: Get All Folders
  console.log('📁 Test 2: Get All Folders');
  await testEndpoint('GET', `${API_BASE}/folders`);
  
  // Test 3: Create New Folder
  console.log('📁 Test 3: Create New Folder');
  const newFolder = await testEndpoint('POST', `${API_BASE}/folders`, {
    name: 'Test Folder from Script'
  });
  
  // Test 4: Get All Documents
  console.log('📄 Test 4: Get All Documents');
  await testEndpoint('GET', `${API_BASE}/documents`);
  
  // Test 5: Create New Document (if we have a folder)
  if (newFolder && newFolder.id) {
    console.log('📄 Test 5: Create New Document');
    await testEndpoint('POST', `${API_BASE}/documents`, {
      name: 'Test Document.pdf',
      folder_id: newFolder.id,
      file_type: 'pdf',
      size: 2048
    });
  }
  
  // Test 6: Filter Documents by Folder
  if (newFolder && newFolder.id) {
    console.log('📄 Test 6: Filter Documents by Folder');
    await testEndpoint('GET', `${API_BASE}/documents?folder_id=${newFolder.id}`);
  }
  
  // Test 7: Search Documents
  console.log('🔍 Test 7: Search Documents');
  await testEndpoint('GET', `${API_BASE}/documents/search?query=test`);
  
  console.log('✨ All tests completed!');
}

// Run the tests
runTests().catch(console.error);
