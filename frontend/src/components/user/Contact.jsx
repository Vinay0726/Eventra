import { FiUser, FiMail, FiMessageCircle } from "react-icons/fi";

export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-tr from-purple-100 via-white to-green-50 py-20 px-4"
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-10 text-lg">
          Have questions or need support? Reach out and we'll get back to you
          shortly!
        </p>

        <form className="space-y-6 bg-white bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-xl text-left">
          {/* Name */}
          <div className="relative">
            <FiUser className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Your Name"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <FiMessageCircle className="absolute left-4 top-3.5 text-gray-400 text-xl" />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
          >
            📩 Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
