import Navbar from "@/components/organisms/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import SchedulesCarousel from "@/components/organisms/SchedulesCarousel";
import NewsSection from "@/components/organisms/News";
import PaymentChecker from "@/components/molecules/PaymentChecker";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar useScrollEffect={true} />
      <Hero />
      
      {/* Payment Checker Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Check Your Payment Status
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your booking ID to check the current status of your payment
            </p>
          </div>
          <PaymentChecker />
        </div>
      </section>
      
      <SchedulesCarousel />
      <NewsSection />
      {/* <Testimonials /> */}
      <Footer />
    </div>
  );
}
