const { jsPDF } = require('jspdf');
const fs = require('fs');
const https = require('https');
const wordcut = require('wordcut');
const axios = require('axios');
const { create } = require('domain');


process.on('uncaughtException', function (err) {
  console.log(err);
});

//This is mock up items
const items = {
  documentItems: [
    {id:'1' , productId:'DF001', quantity:1, unitName:'ชิ้น', productName:'บราวนี่', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:100},
    {id:'2' , productId:'DF002', quantity:2, unitName:'ถ้วย', productName:'ก๋วยเตียว', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:200},
    {id:'3' , productId:'DF003', quantity:3, unitName:'แก้ว', productName:'นมสด', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:300},
    {id:'4' , productId:'DF004', quantity:4, unitName:'หวี', productName:'กล้วย', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:400},
    {id:'5' , productId:'DF005', quantity:5, unitName:'ผล', productName:'แอปเปิ้ล', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:500},
    {id:'6' , productId:'DF006', quantity:6, unitName:'ตัว', productName:'ปลาย่าง', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:600},
    {id:'7' , productId:'DF001', quantity:1, unitName:'ชิ้น', productName:'บราวนี่', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:100},
    {id:'8' , productId:'DF002', quantity:2, unitName:'ถ้วย', productName:'ก๋วยเตียว', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:200},
    {id:'9' , productId:'DF003', quantity:3, unitName:'แก้ว', productName:'นมสด', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:300},
    {id:'10' , productId:'DF004', quantity:4, unitName:'หวี', productName:'กล้วย', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:400},
    {id:'11' , productId:'DF005', quantity:5, unitName:'ผล', productName:'แอปเปิ้ล', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:500},
    {id:'12' , productId:'DF006', quantity:6, unitName:'ตัว', productName:'ปลาย่าง', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:600},
    {id:'13' , productId:'DF001', quantity:1, unitName:'ชิ้น', productName:'บราวนี่', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:100},
    {id:'14' , productId:'DF002', quantity:2, unitName:'ถ้วย', productName:'ก๋วยเตียว', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:200},
    {id:'15' , productId:'DF003', quantity:3, unitName:'แก้ว', productName:'นมสด', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:300},
    {id:'16' , productId:'DF004', quantity:4, unitName:'หวี', productName:'กล้วย', productDescription:'บราวนี่รสชาติดี', unitPrice:100 , priceBeforeTax:400},
  ],
  logoCompany:'https://plus.unsplash.com/premium_photo-1674518547392-458ab4714c25?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80',
  name:'นน จำกัด',
  taxIdent: '1234567890123',
  address: '99 หมู่ 1 ตำบล หนองบัว อำเภอ เมือง จังหวัด นครศรีธรรมราช 80000',
  telephone: '075-355-355',
  email: 'นน@gmail.com',
  data: { 0: {
    name:'Head Quater',
  }},
  eStamp:'https://images.unsplash.com/photo-1490077476659-095159692ab5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1151&q=80',
  signature:'https://images.unsplash.com/photo-1542370285-b8eb8317691c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1126&q=80',
  contactName:'กิตติภัทธ์ จำกัด',
  contactBranch:'สาขา 1',
  contactAddress:'99 หมู่ 1 ตำบล หนองบัว อำเภอ เมือง จังหวัด นครศรีธรรมราช 80000',
  contactTaxId:'1234567890123',
  code:'QT1321546546445',
  referenceNo:'RF1321546546445',
  issueDate:'2023-07-17T00:00:00.000Z',
  contactPerson:'น้องนน',
  contactPhone:'075-355-355',
  moneyText : {
    thai:'หนึ่งแสนสี่หมื่นหนึ่งพันสองร้อยสามสิบสี่บาทห้าสิบหกสตางค์',
    eng:'One Thousand Two Hundred Thirty Four Baht Fifty Six Satang',
  },
  vatAmount:'1869.54',       //หาตัวแปรของ subTotal กับ Total ไม่เจอ
  discountAmount:'0.00',
  grandTotal:'1869.54',
  subTotal:'1869.54',
  total:'1869.54',
  remark:'คอรัปชั่นช็อคซิมโฟนี่ศิลปวัฒนธรรมตุ๊กตุ๊ก มิลค์ แคนู รีดไถมาร์ชเฟรชก่อนหน้า ซีเนียร์อุเทนรองรับ แซ็กโซโฟนซูมสต็อคจ๊อกกี้ โปรเจคท์ภคันทลาพาธธรรมาภิบาล โรแมนติกเฝอก่อนหน้าแม่ค้า ป๊อกเทเลกราฟโพลล์ วิน รามเทพ เซาท์ตนเองเกจิเทอร์โบไอติม ผิดพลาดชัวร์ โรแมนติคโปรเจกเตอร์เกรดไลท์ ไวอากร้าออดิทอเรียมเสกสรรค์แอปเปิ้ลไวกิ้ง ชินบัญชรคอนโทรลเวณิกาสเก็ตช์ มาร์เก็ตแคนยอนนิรันดร์ เวิลด์พล็อตมั้งอาว์เคลื่อนย้าย ทรูแฟ้บ ชินบัญชร วอล์คไฟต์อิเลียด สตาร์หมายปองเยอร์บีราแมมโบ้ มาร์คฮองเฮา เกย์ออกแบบ ดยุคเซ็กซ์ คอร์ป เรซิ่นแอดมิสชันเยอบีรา ยูโรหลินจือกรุ๊ปสมาพันธ์ล็อบบี้ มายาคติสตาร์โอวัลตินออโต้เซฟตี้ ตู้เซฟถูกต้องโรลออนไลฟ์ มือถือก่อนหน้าสเก็ตช์แบ็กโฮแฮนด์',
  approvalPerson:'กิตติภัทธ์ โลวตระกูล',     //ไม่แน่ใจ
  paymentCondition:'จ่ายภายใน 30 วัน โดยโอนไปที่บัญชีธนาคารกรุงไทย 12345678975',
  dueDate:'2023-07-19T00:00:00.000Z' //หาตัวแปรไม่เจอของช่อง ครบกำหนด / Valid
};

async function generatePDF(callback) {
  const doc = new jsPDF();
  
  //หาจุดกึ่งกลางของช่อง
  function getStartPoint(text, width) {
    const textWidth = doc.getTextWidth(text);
    return (width - textWidth) / 2;
  }
  
  //ดาวน์โหลดรูป
  function downloadImage(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        const chunks = [];
        
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          const imageData = Buffer.concat(chunks);
          resolve(imageData);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }
  async function addImageToPDF(url,x,y,width,height){
    const imageData = await downloadImage(url);
    doc.addImage(imageData, "JPEG", x, y, width, height);
  }
  
  //import ภาษาไทย
  doc.addFont('THSarabunNew.ttf', 'THSarabunNew', 'normal');
  doc.addFont('THSarabunNewBold.ttf', 'THSarabunNew', 'bold');
  doc.setFontSize(12);
  
  //สร้าง Header
  async function createHeader(items) {
    //Logo
    await addImageToPDF(items.logoCompany, 10, 10, 20, 24);
    //หัวข้อ
    doc.setFont('THSarabunNew','bold');
    doc.setFontSize(26);
    doc.text("ใบแจ้งหนี้",200, 25,'right');
    doc.setFontSize(16);
    doc.text("Invoice",200, 30,'right');
    
    //คนขาย
    doc.setFontSize(12);
    doc.setFont('THSarabunNew','bold');
    doc.text('ชื่อบริษัท / Company Name :', 10, 45);  
    doc.text('ที่อยู่ / Address :', 10, 50);
    doc.text('เบอร์โทรศัพท์ / Tel :', 10, 55);
    doc.text('เลขประจำตัวผู้เสียภาษี / Tax ID :', 105, 45);
    doc.text('สาขา / Branch :', 105, 55);
    doc.text('อีเมลล์ / E-mail :', 10, 60);
    //คนขาย(นำข้อมูลมาแสดง)
    doc.setFont('THSarabunNew','normal');
    doc.text(items.name, 48, 45);
    doc.text(items.address, 32, 50);
    doc.text(items.telephone, 36, 55);
    doc.text(items.taxIdent, 146, 45);
    doc.text(items.data[0].name, 126.5, 55);
    doc.text(items.email, 32, 60);
    
    doc.line(10, 64, 200, 64); //line ระหว่างคนขายกับลูกค้า
    
    //ลูกค้า
    doc.setFont('THSarabunNew','bold');
    doc.text('ลูกค้า / Customer :', 10, 70);
    doc.text('ที่อยู่ / Address :', 10, 75);
    doc.text('เลขผู้เสียภาษี / Tax ID :', 10, 80);
    doc.text('เลขที่ / No. :', 10, 85);
    doc.text('อ้างอิง / Ref. :', 10, 90);
    doc.text('ครบกำหนด / Valid :', 10, 95)
    doc.text('สาขา / Branch :', 105, 70);
    doc.text('วันที่ / Issue :', 105, 80);
    doc.text('ผู้ติดต่อ / Attention :', 105, 85);
    doc.text('เบอร์โทรศัพท์ / Tel. :', 105, 90);
    doc.text('เงื่อนไขการชำระเงิน / Payment condition :', 105, 95)
    
    //ลูกค้า(นำข้อมูลมาแสดง)
    doc.setFont('THSarabunNew','normal');
    doc.text(items.contactName, 35.5, 70);
    doc.text(items.contactAddress, 32, 75);
    doc.text(items.contactTaxId, 39.5, 80);
    doc.text(items.code, 26.5, 85);
    doc.text(items.referenceNo, 28.5, 90);
    doc.text(items.dueDate.slice(0,10), 35.5, 95);
    doc.text(items.contactBranch, 126.5, 70);
    doc.text(items.issueDate.slice(0,10), 123, 80);
    doc.text(items.contactPerson, 132, 85);
    doc.text(items.contactPhone, 131.5, 90);
    doc.text(items.paymentCondition,159.5 ,95)
  }
  
  async function createTable(items) {
    //ตารางรายการสินค้า
    doc.rect(10, 100, 190, 89);
    //หัวตาราง
    doc.setFont('THSarabunNew','bold');
    doc.rect(10, 100, 190, 15);
    doc.text('เลขที่', 14, 105);
    doc.text('No.', 14.7, 110);
    doc.text('รหัสสินค้า', 30, 105);
    doc.text('Product No.', 28.5, 110);
    doc.text('สินค้า/คำอธิบาย', 65, 105);
    doc.text('Product/Description', 61, 110);
    doc.text('จำนวน', 102, 105);
    doc.text('Quantity', 100.5, 110);
    doc.text('หน่วย', 119, 105);
    doc.text('Unit', 119.5, 110);
    doc.text('ราคาต่อหน่วย(บาท)', 135, 105);
    doc.text('Unit Price(Baht)', 136.2, 110);
    doc.text('มูลค่าก่อนภาษี', 172.5, 105);
    doc.text('Pre-tax amount', 170.5, 110);
    
    //ข้อมูลในตาราง
    doc.setFont('THSarabunNew','normal');
    doc.setTextColor(0,0,0);
    
    for (let i=0; i<items.length; i++) {
      doc.text(items[i].id, getStartPoint(items[i].id,14)+10, 122.5 + (i*12));
      doc.text(items[i].productId, getStartPoint(items[i].productId,24)+24, 122.5 + (i*12));
      doc.text(items[i].productName, getStartPoint(items[i].productName,50)+48, 120 + (i*12));
      doc.setFontSize(10);
      doc.text(items[i].productDescription, getStartPoint(items[i].productDescription,50)+48, 125 + (i*12));
      doc.setFontSize(12);
      doc.text(items[i].quantity.toString(), getStartPoint(items[i].quantity.toString(),16.5)+98, 122.5 + (i*12));
      doc.text(items[i].unitName, getStartPoint(items[i].unitName,15.5)+114.5, 122.5 + (i*12));
      doc.text(items[i].unitPrice.toString(), getStartPoint(items[i].unitPrice.toString(),33)+130, 122.5 + (i*12));
      doc.text(items[i].priceBeforeTax.toString(), getStartPoint(items[i].priceBeforeTax.toString(),37)+163, 122.5 + (i*12));
    }
    
  }
  
  async function createFooter(items) {
    //สรุปเงิน
    doc.setFont('THSarabunNew', 'bold');
    doc.text('ส่วนลด / Discount', 105, 195);
    doc.text('ราคาสุทธิสินค้าที่เสียภาษี / Sub Total', 105, 200);
    doc.text('ภาษีมูลค่าเพิ่ม / Vat', 105, 205);
    doc.text('ราคารวมก่อนหัก ณ ที่จ่าย / Total', 105, 210);
    doc.text('จำนวนเงินรวมทั้งสิ้น / Grand Total', 105, 215);
    
    doc.text(items.discountAmount, 200, 195,'right');
    doc.text(items.subTotal, 200, 200,'right');
    doc.text(items.vatAmount, 200, 205,'right');
    doc.text(items.total, 200, 210,'right');
    doc.text(items.grandTotal, 200, 215,'right');
    
    const moneyInText = items.moneyText.thai;
    const moneyEngText = items.moneyText.eng;
    const allMoneyText = 'จำนวนเงินรวมทั้งสิ้น  ' + moneyInText;
    //เขียนจำนวนเงินเป็นตัวหนังสือ
    
    function displayAllMoneyText(allMoneyText, moneyEngText) {
      const maxWidth = 90; // Maximum width in points
      let line1 = '';
      let line2 = '';
      let eng1 = '';
      let eng2 = '';
      let currentLineWidth = 0;
      let currentEngWidth = 0;
      wordcut.init();
      const wordList = wordcut.cut(allMoneyText);
      const wordArray = wordList.split('|');
      wordArray.forEach((word) => {
        if (currentLineWidth + doc.getTextWidth(word) < maxWidth) {
          line1 += word;
          currentLineWidth += doc.getTextWidth(word);
        } else {
          line2 += word;
        }
      });
      moneyEngText.split(" ").forEach((word) => {
        if (currentEngWidth + doc.getTextWidth(word+" ") < maxWidth) {
          eng1 += " " +  word;
          currentEngWidth += doc.getTextWidth(word+" ");
        } else {
          eng2 += " " + word;
        }
      });
      
      
      doc.text(line1, 200, 220, 'right');
      doc.text(line2, 200, 225, 'right');
      doc.text(eng1, 200, 230, 'right');
      doc.text(eng2, 200, 235, 'right');
    }
    displayAllMoneyText(allMoneyText, moneyEngText);
    
    
    //วิธีการชำระเงิน
    doc.setFont('THSarabunNew', 'bold');
    doc.setFillColor(241, 241, 241);
    doc.setDrawColor(241,241,241);
    doc.rect(10, 192, 50, 8,'FD');
    doc.text('หมายเหตุ / Remark', 12, 197);
    
    //ข้อความในวิธีการชำระเงิน
    doc.setFont('THSarabunNew', 'normal');
    const remarkText = items.remark;
    function displayRemarkText(remarkText) {
      const maxWidth = 90; // Maximum width in points
      const maxLines = 6; // Maximum number of lines to display
      let currentLine = 1;
      let currentLineWidth = 0;
      let line = '';
      wordcut.init();
      const wordList = wordcut.cut(remarkText);
      const wordArray = wordList.split('|');
      wordArray.forEach((word) => {
        if (currentLine <= maxLines) {
          if (currentLineWidth + doc.getTextWidth(word) < maxWidth) {
            line += word;
            currentLineWidth += doc.getTextWidth(word);
          } else {
            doc.text(line, 10, 204 + (5 * (currentLine - 1)));
            currentLine++;
            line = word;
            currentLineWidth = doc.getTextWidth(word);
          }
        }
      });
      doc.text(line, 10, 204 + (5 * (currentLine - 1)));
    }
    
    // Example usage:
    displayRemarkText(remarkText);
    
    // สร้างกล่องลงชื่อ
    doc.setDrawColor(0,0,0);
    doc.rect(10, 247, 190, 40);
    doc.line(57.5,247,57.5,287);
    doc.line(105,247,105,287);
    doc.line(152.5,247,152.5,287);
    
    //กล่องแรก
    doc.setFontSize(12);
    doc.setFont('THSarabunNew', 'bold');
    doc.text("สร้างโดย / Created by", 20, 252);
    doc.setLineWidth(0.1);
    doc.line(17.5, 270, 50, 270); //ลายเซ็น
    await addImageToPDF(items.signature, 18.35, 255, 30.8, 14.23);
    
    const nameFieldText = items.approvalPerson;
    const nameFieldWidth = doc.getTextWidth('(.......................................................)');
    const startPoint = getStartPoint(nameFieldText, nameFieldWidth);
    doc.setFont('THSarabunNew', 'normal');
    doc.text("(.......................................................)", 14, 277); //เซ็นชื่อกำกับ
    doc.text(nameFieldText, startPoint+14, 275.8); //text รับข้อมูลเป็น text มา
    
    doc.setFont('THSarabunNew', 'bold');
    doc.text("วันที่ / Date", 13, 284);
    doc.setFont('THSarabunNew', 'normal');
    doc.text(items.issueDate.slice(0,10), getStartPoint(items.issueDate.slice(0,10), doc.getTextWidth("......................................."))+28, 282.8);
    doc.text(".......................................", 28, 284);
    
    //text กล่องที่สอง
    doc.setFont('THSarabunNew','bold');
    doc.text("อนุมัติโดย / Approved by", 65.5, 252);
    doc.setLineWidth(0.1);
    doc.line(65, 270, 97.5, 270);
    await addImageToPDF(items.signature, 66.35, 255, 30.8, 14.23);
    doc.setFont('THSarabunNew','normal');
    doc.text("(.......................................................)", 61.5, 277);
    doc.text(nameFieldText, startPoint+61.5, 275.8);
    doc.setFont('THSarabunNew','bold');
    doc.text("วันที่ / Date", 60.5, 284);
    doc.setFont('THSarabunNew','normal');
    doc.text(items.issueDate.slice(0,10), getStartPoint(items.issueDate.slice(0,10), doc.getTextWidth("......................................."))+75.5, 282.8);
    doc.text(".......................................", 75.5, 284 );  
    
    //กล่องสาม
    await addImageToPDF(items.eStamp, 109, 250, 40, 25);
    doc.setFontSize(14);
    doc.setFont('THSarabunNew','bold');
    doc.setTextColor(100,100,100);
    doc.text('ตราประทับบริษัท', getStartPoint('ตราประทับบริษัท',47.5)+105, 282);
    
    //text กล่องที่สี่
    doc.setFont('THSarabunNew','bold');
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text("ยอมรับใบแจ้งหนี้ / Accepted by", 156.5, 252);
    doc.setLineWidth(0.1);
    doc.line(160, 270, 192.5, 270); //ลายเซ็น
    await addImageToPDF('https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Autograph_of_Benjamin_Franklin.svg/1200px-Autograph_of_Benjamin_Franklin.svg.png', 161.35, 255, 30.8, 14.23);
    doc.setFont('THSarabunNew','normal');
    doc.text("(.......................................................)", 157, 277); //เซ็นชื่อกำกับ
    /* doc.text("กำก่ำอุอูอ่า",17.5,113.8,'center') */  //ยังไม่ได้ center text
    doc.setFont('THSarabunNew','bold');
    doc.text("วันที่ / Date", 156, 284);
    doc.setFont('THSarabunNew','normal');
    doc.text(".......................................", 170.5, 284 );
    
  }
  
  function sliceArray(array, size) {
    var slicedArray = [];
    for (var i = 0; i < array.length; i += size) {
      var slice = array.slice(i, i + size);
      slicedArray.push(slice);
    }
    return slicedArray;
  }

  const dataEachPage = sliceArray(items.documentItems, 6);

 for (let i = 0; i < dataEachPage.length; i++) {
  if (i < dataEachPage.length - 1) {
    await createHeader(items);
    await createTable(dataEachPage[i]);
    doc.addPage();
  }
  else  {
    await createHeader(items);
    await createTable(dataEachPage[i]);
    await createFooter(items);
  }
}

/*   //สร้าง element
  await createHeader(items);
  await createTable(items);
  await createFooter(items); */
  
  
  
  const pdfPath = `./output-${Date.now()}.pdf`;
  let saveDoc = doc
  
  saveDoc.save(pdfPath);
  
  fs.readFile(pdfPath, (err, data) => {
    if (err) {
      console.error(`Error reading PDF file: ${err}`);
      callback(err);
    } else {
      callback(null, data);
    }
    
    fs.unlink(pdfPath, (err) => {
      if (err) {
        console.error(`Error deleting PDF file: ${err}`);
      }
    });
  });
}


module.exports = {
  generatePDF
};
