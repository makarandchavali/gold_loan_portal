// All your n8n webhook URLs
export const N8N_WEBHOOKS = {
  dailyBusiness: process.env.REACT_APP_N8N_DAILY_BUSINESS_WEBHOOK,
  goldStock: process.env.REACT_APP_N8N_GOLD_STOCK_WEBHOOK,
  kycCompliance: process.env.REACT_APP_N8N_KYC_COMPLIANCE_WEBHOOK,
  loanRecovery: process.env.REACT_APP_N8N_LOAN_RECOVERY_WEBHOOK,
  customerFeedback: process.env.REACT_APP_N8N_CUSTOMER_FEEDBACK_WEBHOOK,
};

// Function to send data to n8n webhook
export const sendToN8N = async (webhookUrl, data) => {
  try {
    if (!webhookUrl) {
      throw new Error('Webhook URL is not configured');
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending data to n8n:', error);
    return { success: false, error: error.message };
  }
};
