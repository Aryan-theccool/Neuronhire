# 🧠 NeuronHire: The Specialized AI Talent Marketplace

![NeuronHire Banner](https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=400)

NeuronHire is a premium, managed ecosystem designed to connect elite AI Engineering talent with the world's most innovative companies. Built for the move towards an AI-first economy, it transcends traditional job boards by focusing on verified technical depth and product IP.

## 🚀 Key Features

### 1. Self-Healing Infrastructure
Our proprietary **Self-Healing Profile System** eliminates the friction of broken user states. The platform automatically initializes database profiles for Auth users on-the-fly, ensuring a 100% success rate for job and bounty publications.

### 2. The Hybrid Feed Engine
A sophisticated marketplace logic that prioritizes real-time user-generated opportunities while maintaining a high-density, professional aesthetic using curated "Genesis Samples."

### 3. Neuron Scoring & Verification
Move beyond resumes. NeuronHire uses a proprietary (0-100) scoring system that measures actual AI engineering mastery, from RAG pipeline architecture to custom model fine-tuning.

### 4. Interactive Command Center
A unified dashboard for both Companies and Engineers to manage:
- **Active Roles & Bounties**: Real-time tracking of published opportunities.
- **Milestone Management**: Goal-oriented contract tracking.
- **Portfolio Verification**: Showcasing validated technical wins.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + RLS)
- **Styling**: Modern CSS with Glassmorphism & High-End Animations
- **Infrastructure**: Vercel
- **Email**: [Resend](https://resend.com/)
- **Payments**: [Razorpay](https://razorpay.com/) (Integrated)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- A Supabase Project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neuronhire.git
   cd neuronhire
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_secret
   RESEND_API_KEY=your_resend_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🗺️ Future Roadmap

- [ ] **Neuron Live**: Real-time AI technical interviewing agent.
- [ ] **Smart Milestones**: Autonomous GitHub-tracking for automated payment releases.
- [ ] **Compute Credits**: Integrated GPU partitioning for high-end AI bounties.

---

Built with ❤️ for the AI Engineering Community.
