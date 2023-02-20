const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const indexRouter = require("./routes/index");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const { result } = require("lodash");
const bucketName = 'ossu-images/';


const app = express();

app.set('view engine', 'ejs');
app.set('layout', `${__dirname}/views/layouts/layout`);

app.use(expressLayouts);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
// Uses Functions.js
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

app.use('/', indexRouter);

// Database Here
const storage = new Storage({
  keyFilename: `${__dirname}/bishop.json`
});


app.post('/api/pictures', (req, res) => {

  const { name } = req.query;
  prefix = `${name}/`;

  let result = {
    "pictures": []
  };

  if (!name) {return res.status(400).json({ error: "Amatuer" });}

  // Make google cloud request. 
  // Use the "name" variable from the query to filter which urls you get back or something.
  async function listImages() {

    const [charImages] = await storage.bucket(bucketName).getFiles();

    charImages.forEach(file => {

      let nameBuffer = file.name;

      if (nameBuffer.includes(prefix)) {
      let folder_path = file.publicUrl();
      result.pictures.push(folder_path);
      }

    });

    result.pictures.shift();
    return res.json(result);
  }

  listImages().catch(console.error);
});






// This will return the dropdown select options for gallery
app.get('/api/getOptions', (req, res) => {

  const prefixChar = 'glamours/';
  const prefixGroup = 'group-pictures/';

  const optionsChar = {
    prefix: prefixChar,
    delimiter: '/',
    includeTrailingDelimiter: true,
    autoPaginate: false
  };

  const optionsGroup = {
    prefix: prefixGroup,
    delimiter: '/',
    includeTrailingDelimiter: true,
    autoPaginate: true
  };

  let data = {
    'charDropdown': [],
    'groupDropdown': []
  }

  async function listFiles() {

    const [charFiles] = await storage.bucket(bucketName).getFiles(optionsChar);
    const [groupFiles] = await storage.bucket(bucketName).getFiles(optionsGroup);

    charFiles.forEach(file => {
      let folder_path = file.name;
      if (folder_path.length > prefixChar.length + 1) {
        charOptions = folder_path.slice(prefixChar.length, folder_path.length - 1);
        data.charDropdown.push(charOptions);
      }
    });
    
    groupFiles.forEach(file => {
      let folder_path = file.name;
      if (folder_path.length > prefixGroup.length + 1) {
        groupOptions = folder_path.slice(prefixGroup.length, folder_path.length - 1);
        data.groupDropdown.push(groupOptions);
      }
    });

    return res.json(data);
  }

  listFiles().catch(console.error);
});

// App Listen
app.listen(3000, () => {
  console.log("Server running on port 3000");
});