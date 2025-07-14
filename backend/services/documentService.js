const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const processManual = async (file, machineType) => {
  try {
    let text = '';
    
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      text = data.text;
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      text = result.value;
    } else {
      throw new Error('Unsupported file type');
    }

    // Process and extract troubleshooting information
    const troubleshootingData = extractTroubleshootingData(text, machineType);
    
    return {
      success: true,
      machineType,
      extractedItems: troubleshootingData.length,
      message: 'Manual processed successfully'
    };
  } catch (error) {
    throw new Error(`Document processing failed: ${error.message}`);
  }
};

const extractTroubleshootingData = (text, machineType) => {
  // Simple extraction logic - can be enhanced with NLP
  const sections = text.split(/TROUBLE\s*SHOOTING|Trouble\s*Shooting|troubleshooting/i);
  const troubleshootingData = [];
  
  // Extract problem-solution pairs
  // This is a simplified version - enhance based on manual structure
  
  return troubleshootingData;
};

module.exports = { processManual };
