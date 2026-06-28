import axios from 'axios';

async function test() {
  try {
    const response = await axios.get('http://localhost:5011/api/articles');
    console.log("data type:", typeof response.data);
    console.log("data keys:", Object.keys(response.data));
    console.log("data.data type:", typeof response.data.data);
    console.log("Is array?", Array.isArray(response.data.data));
    console.log("Length:", response.data.data?.length);
  } catch (err) {
    console.log('Error:', err.message);
  }
}
test();
