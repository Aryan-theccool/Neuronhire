export const PROPOSAL_RECEIVED_TEMPLATE = (companyName: string, jobTitle: string, engineerName: string) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>New AI Proposal Received!</h2>
    <p>Hi ${companyName},</p>
    <p><strong>${engineerName}</strong> has just submitted a proposal for your job: <strong>${jobTitle}</strong>.</p>
    <p>Visit your dashboard to review their NeuronScore and Case Studies.</p>
    <a href="https://NeuralHire.app/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; borderRadius: 5px;">Review Proposal</a>
  </div>
`

export const INVITATION_RECEIVED_TEMPLATE = (engineerName: string, companyName: string, jobTitle: string) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>You've Been Invited to Apply!</h2>
    <p>Hi ${engineerName},</p>
    <p><strong>${companyName}</strong> is impressed by your NeuronScore and has invited you to apply for: <strong>${jobTitle}</strong>.</p>
    <p>Check the details and submit your interest.</p>
    <a href="https://NeuralHire.app/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: #fff; text-decoration: none; borderRadius: 5px;">View Invitation</a>
  </div>
`

export const CONTRACT_STARTED_TEMPLATE = (engineerName: string, jobTitle: string) => `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
    <h2>Work Started! 🚀</h2>
    <p>Congratulations ${engineerName},</p>
    <p>Your proposal for <strong>${jobTitle}</strong> has been accepted. You are now officially hired for this role.</p>
    <p>Check your dashboard for work milestones and payment details.</p>
  </div>
`

