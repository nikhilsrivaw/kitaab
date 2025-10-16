  Understanding File Preview Code

  if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
  }

  ---
  Line-by-Line Breakdown:

  Line 1: if (file.type.startsWith('image/'))

  What is file.type?
  - Every file has a MIME type (tells you what kind of file it is)
  - Examples:
  image/png       → PNG image
  image/jpeg      → JPG image
  image/gif       → GIF image
  application/pdf → PDF document
  video/mp4       → MP4 video
  text/plain      → Text file

  What does startsWith('image/') do?
  - Checks if the file type STARTS with "image/"
  - Returns true for ANY image type
  - Returns false for non-images

  Examples:
  'image/png'.startsWith('image/')    // ✅ true
  'image/jpeg'.startsWith('image/')   // ✅ true
  'application/pdf'.startsWith('image/') // ❌ false
  'video/mp4'.startsWith('image/')    // ❌ false

  Why check this?
  - We only want to show previews for images
  - PDFs, videos, text files don't need image preview
  - Prevents errors when trying to show non-image as image

  ---
  Line 2: const reader = new FileReader();

  What is FileReader?
  - Built-in JavaScript API (comes with the browser)
  - Reads file contents from user's computer
  - Converts files into formats JavaScript can use

  Why do we need it?
  - Files are binary data (just 0s and 1s)
  - We can't directly display binary in <img> tags
  - FileReader converts file → readable format

  Analogy:
  File on disk:     [binary: 01010101010...]
  FileReader:       Translator
  Result:           data:image/png;base64,iVBORw0KG... (readable by browser)

  ---
  Line 3-5: reader.onloadend = () => { ... }

  What is onloadend?
  - An event handler (callback function)
  - Runs AFTER the file is finished reading
  - Similar to onClick, onChange, etc.

  Why "onloadend"?
  - Reading files takes time (asynchronous)
  - Can't use the result immediately
  - Need to wait until reading is complete

  Flow:
  // Step 1: Start reading
  reader.readAsDataURL(file);  // This starts the reading process

  // Step 2: Wait... (reading happens in background)

  // Step 3: When done, onloadend runs
  reader.onloadend = () => {
      console.log('Reading finished!');
  };

  Visual Timeline:
  Time 0ms:   reader.readAsDataURL(file) called → Reading starts
  Time 50ms:  Still reading... (background process)
  Time 100ms: Still reading...
  Time 150ms: Reading complete! → onloadend fires

  ---
  Line 4: setFilePreview(reader.result);

  What is reader.result?
  - Contains the file data AFTER reading is complete
  - Format: data:image/png;base64,iVBORw0KG...
  - This is a Data URL (image encoded as text)

  What's a Data URL?
  Normal URL:  https://example.com/image.png
  Data URL:    data:image/png;base64,iVBORw0KGgo...

  Structure:
  data:image/png;base64,iVBORw0KGgoAAAANS...
  │    │         │       │
  │    │         │       └─ Actual image data (encoded)
  │    │         └─ Encoding type (base64)
  │    └─ File type (image/png)
  └─ Protocol (data URL)

  Why use Data URL?
  - Can be used directly in <img src="...">
  - No need to upload to server first for preview!
  - Works completely in browser

  Example:
  // After reading, reader.result looks like:
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..."

  // Can use it directly:
  <img src={reader.result} />  // ✅ Shows the image!

  What does setFilePreview do?
  - Saves the Data URL to state
  - React re-renders
  - Now you can show preview: <img src={filePreview} />

  ---
  Line 6: reader.readAsDataURL(file);

  What does readAsDataURL do?
  - Starts reading the file
  - Converts file → Data URL format
  - Asynchronous (doesn't block code)

  Why "AsDataURL"?
  - FileReader has different read methods:

  reader.readAsDataURL(file)    // → data:image/png;base64...
  reader.readAsText(file)        // → "Hello World" (for text files)
  reader.readAsArrayBuffer(file) // → Binary data
  reader.readAsBinaryString(file)// → Binary string

  - readAsDataURL is perfect for images (can display directly)

  ---
  Complete Flow Example:

  // 1. User selects image file (cat.jpg - 1MB)
  const file = event.target.files[0];

  // 2. Check if it's an image
  if (file.type.startsWith('image/')) {  // ✅ true (image/jpeg)

      // 3. Create reader
      const reader = new FileReader();

      // 4. Set up what happens when done
      reader.onloadend = () => {
          // This runs AFTER reading completes
          console.log(reader.result);
          // Logs: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."

          setFilePreview(reader.result);  // Save to state
      };

      // 5. Start reading (kicks off the process)
      reader.readAsDataURL(file);

      // 6. Code continues (doesn't wait)
      console.log("Reading started!");
  }

  // Timeline:
  // 0ms:   reader.readAsDataURL called
  // 0ms:   "Reading started!" logged
  // 50ms:  Still reading...
  // 100ms: Reading done → onloadend fires
  // 100ms: reader.result available
  // 100ms: setFilePreview called
  // 100ms: Component re-renders with preview

  ---
  Why Not Simpler?

  Why can't we do this?
  // ❌ Doesn't work!
  const preview = reader.readAsDataURL(file);
  setFilePreview(preview);  // preview is undefined!

  Because:
  - readAsDataURL doesn't return the result
  - It's asynchronous (takes time)
  - Result is only available in reader.result after onloadend fires

  Modern Alternative (Promises):
  // More modern way (but older browsers might not support):
  const readFile = (file) => {
      return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
      });
  };

  // Usage:
  const preview = await readFile(file);
  setFilePreview(preview);

  ---
  Real-World Analogy:

  FileReader is like a Scanner:

  You: "Scan this photo for me"
       (reader.readAsDataURL(file))

  Scanner: "Sure, starting scan..."
           (reading in background)

  Scanner: "Scan complete! Here's the digital version"
           (onloadend fires)

  You: "Thanks! Let me show it on screen"
       (setFilePreview(reader.result))

  Screen: Shows the image
          (<img src={filePreview} />)

  ---
  Visual Example:

  Before reading:
  file = {
      name: "cat.jpg",
      size: 1048576,
      type: "image/jpeg",
      // Actual binary data inaccessible
  }

  After readAsDataURL:
  reader.result = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
                   └─ This can be used in <img src="..." />

  In React:
  <img src={filePreview} alt="Preview" />
  // Renders: 🐱 (shows the cat image!)

  ---
  Summary:

  1. Check if image: file.type.startsWith('image/')
  2. Create reader: new FileReader()
  3. Set callback: reader.onloadend = () => { ... }
  4. Save result: setFilePreview(reader.result)
  5. Start reading: reader.readAsDataURL(file)
