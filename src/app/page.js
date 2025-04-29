"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaDollarSign, FaBell, FaCheckCircle, FaBars, FaTimes, FaShoppingCart, FaStar } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 w-full bg-white shadow-sm z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-emerald-600 w-6 h-6" />
            <span className="text-xl font-bold text-emerald-600">ShopOrganizer</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-emerald-600 transition-colors">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-emerald-600 transition-colors">Pricing</a>
            <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">Testimonials</a>
            <a href="#cta" className="text-gray-600 hover:text-emerald-600 transition-colors" onClick={() => { window.location.href = '/signup'; }}>Get Started</a>
            <a href="#cta" className="text-gray-900 hover:text-emerald-600 transition-colors bg-emerald-300 px-4 rounded-lg" onClick={() => { window.location.href = '/login'; }}>Login</a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden bg-white pb-4"
          >
            <a href="#features" className="block px-4 py-2 text-gray-600 hover:bg-emerald-50">Features</a>
            <a href="#pricing" className="block px-4 py-2 text-gray-600 hover:bg-emerald-50">Pricing</a>
            <a href="#testimonials" className="block px-4 py-2 text-gray-600 hover:bg-emerald-50">Testimonials</a>
            <a href="#cta" className="block px-4 py-2 text-gray-600 hover:bg-emerald-50">Get Started</a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-16">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-emerald-800 mb-6">
            Smart Shopping Made Simple
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Organize your shopping lists, track expenses, and never miss important purchases with our intuitive platform
          </p>
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg 
            hover:bg-emerald-700 transition-colors duration-300 font-semibold
            flex items-center mx-auto gap-2">
            <FaCheckCircle className="inline-block" />
            Start Free Trial
          </button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-emerald-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-emerald-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-emerald-800 mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                <div className="text-4xl font-bold text-emerald-600 mb-6">
                  {plan.price}<span className="text-lg text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <FaCheckCircle className="text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-emerald-800 mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-emerald-600"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FaStar className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600">&quot;{testimonial.quote}&quot;</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Shopping?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of organized shoppers today
            </p>
            <button className="bg-white text-emerald-600 px-8 py-3 rounded-lg
              hover:bg-emerald-50 transition-colors duration-300 font-semibold">
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 ShopOrganizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: <FaList className="w-12 h-12 mx-auto" />,
    title: "Smart Lists",
    description: "Create organized shopping lists with categories, quantities, and priority levels."
  },
  {
    icon: <FaDollarSign className="w-12 h-12 mx-auto" />,
    title: "Expense Tracking",
    description: "Track expenses in real-time with budget alerts and spending insights."
  },
  {
    icon: <FaBell className="w-12 h-12 mx-auto" />,
    title: "Smart Reminders",
    description: "Location-based reminders and recurring purchase notifications."
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    features: ["3 Shopping Lists", "Basic Reminders", "1 Device Sync", "Community Support"]
  },
  {
    name: "Pro",
    price: "$9",
    features: ["Unlimited Lists", "Advanced Reminders", "5 Device Sync", "Priority Support", "Expense Reports"]
  },
  {
    name: "Team",
    price: "$29",
    features: ["Team Collaboration", "Unlimited Devices", "Custom Categories", "Dedicated Support", "Team Analytics"]
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Busy Parent",
    quote: "This app has completely transformed how our family shops. Never forget anything anymore!"
  },
  {
    name: "Mike Chen",
    role: "Project Manager",
    quote: "The expense tracking features saved me hundreds of dollars in the first month alone."
  }
];

export default Home;
