import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Gift, Users, Trophy, Calendar, Share2 } from 'lucide-react';
import { getSlideshow } from '../utils/api';

export default function Home() {
  const [slideshow, setSlideshow] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadSlideshow();
  }, []);

  useEffect(() => {
    if (slideshow.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slideshow.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slideshow]);

  const loadSlideshow = async () => {
    try {
      const { data } = await getSlideshow();
      if (data.length > 0) {
        setSlideshow(data);
      } else {
        // Default placeholder
        setSlideshow([
          { image_url: 'https://via.placeholder.com/1200x600/ec4899/ffffff?text=Welcome+Baby+Margo!', caption: 'Our Greatest Adventure Begins!' }
        ]);
      }
    } catch (error) {
      console.error('Failed to load slideshow:', error);
      setSlideshow([
        { image_url: 'https://via.placeholder.com/1200x600/ec4899/ffffff?text=Welcome+Baby+Margo!', caption: 'Our Greatest Adventure Begins!' }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section with Slideshow */}
      <section className="relative h-[600px] bg-gray-900 text-white overflow-hidden">
        {slideshow.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image_url}
              alt={slide.caption || 'Baby slideshow'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
          </div>
        ))}

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Join Us in Welcoming Ms. Margo Jones!
          </h1>
          <p className="text-xl md:text-2xl mb-2">Our Greatest Adventure Begins!</p>
          <p className="text-lg mb-8">Join us in celebrating this magical time</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/betting" className="btn-primary text-lg px-8 py-4">
              Make Your Predictions Now
            </Link>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center gap-2">
              <Share2 size={20} />
              Share
            </button>
          </div>

          {/* Slideshow indicators */}
          {slideshow.length > 1 && (
            <div className="absolute bottom-8 flex gap-2">
              {slideshow.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Join Our Raffle?</h2>
            <p className="text-xl text-gray-600">
              This isn't just any raffle - it's a celebration! Here's what makes it special:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary-600" />
              <h3 className="text-2xl font-bold mb-2">Amazing Prizes</h3>
              <p className="text-gray-600 mb-4">
                Each category has a prize pool of up to half of the total pot!
              </p>
              <p className="text-primary-600 font-semibold">Up to $200+ in prizes!</p>
            </div>

            <div className="card text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-primary-600" />
              <h3 className="text-2xl font-bold mb-2">Easy to Play</h3>
              <p className="text-gray-600 mb-4">
                Just make your predictions, add your info, and Venmo it to us - it's that simple!
              </p>
              <p className="text-primary-600 font-semibold">Takes less than 5 minutes</p>
            </div>

            <div className="card text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-primary-600" />
              <h3 className="text-2xl font-bold mb-2">Sharing is Caring</h3>
              <p className="text-gray-600 mb-4">
                Invite friends to join and help us spread the joy and grow the winnings!
              </p>
              <p className="text-primary-600 font-semibold">More friends = better chances</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/betting" className="btn-primary text-lg">
              Start Playing - It's Free!
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Join our celebration and help us welcome our little bundle of joy with this fun raffle and prediction game!
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-700">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Bring Diapers, Get Tickets</h3>
              <p className="text-gray-600">
                For every pack of diapers you bring, you get one raffle ticket for amazing prizes! 🎁
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-700">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Make Your Predictions</h3>
              <p className="text-gray-600">
                Guess birth date, weight, length, time, delivering doctor, and more!
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-700">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Join the Fun</h3>
              <p className="text-gray-600">
                Register with your details and compete with family and friends.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-700">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Winners Announced</h3>
              <p className="text-gray-600">
                Closest predictions win special prizes after baby arrives!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Spread the Joy */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <Heart className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Spread the Joy!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            The more friends who join, the more fun we'll have! Share this raffle with your loved ones and let's make this celebration unforgettable.
          </p>
          <Link to="/betting" className="btn-secondary text-lg">
            Join the Celebration
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Can't Wait to Meet You, Little One!</h3>
        <p className="text-gray-400">Welcome to our baby raffle! We're so excited to share this journey with you.</p>
      </footer>
    </div>
  );
}
