import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Bike, Clock, Star, MapPin, Phone } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center">
                <span className="text-2xl">🍜</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Indo Foods</h1>
                <p className="text-xs text-slate-600">Authentic Indonesian</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="#menu" className="text-slate-700 hover:text-brand-primary font-medium transition">Menu</a>
              <a href="#about" className="text-slate-700 hover:text-brand-primary font-medium transition">About</a>
              <a href="#contact" className="text-slate-700 hover:text-brand-primary font-medium transition">Contact</a>
              <Link href="/menu" className="btn-primary">
                Order Now
              </Link>
            </div>

            <Link href="/menu" className="md:hidden btn-primary text-sm px-4 py-2">
              Order
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-dark py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-white space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span className="text-sm font-semibold">4.8/5 Rating • 500+ Reviews</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Authentic Indonesian Cuisine
              </h1>

              <p className="text-xl text-orange-100 leading-relaxed">
                Experience the rich flavors of Indonesia. From savory Nasi Goreng to sweet Pisang Goreng, 
                order your favorites for delivery or pickup.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/menu?type=delivery"
                  className="group flex items-center justify-center gap-3 bg-white text-brand-primary font-bold px-8 py-4 rounded-2xl hover:shadow-2xl transition-all"
                >
                  <Bike className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Delivery</span>
                </Link>

                <Link 
                  href="/menu?type=pickup"
                  className="group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Pickup</span>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">30 Min</p>
                    <p className="text-orange-100 text-sm">Avg Delivery</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 fill-yellow-300 text-yellow-300" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">4.8/5</p>
                    <p className="text-orange-100 text-sm">Customer Rating</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800"
                  alt="Indonesian Nasi Goreng"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">500+ Orders</p>
                    <p className="text-slate-600 text-sm">Delivered This Week</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Choose Indo Foods?</h2>
            <p className="text-xl text-slate-600">Authentic taste, fast delivery, exceptional service</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Fast Delivery</h3>
              <p className="text-slate-600 leading-relaxed">
                Average 30-minute delivery time. Hot, fresh, and ready to enjoy.
              </p>
            </div>

            <div className="card p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🌶️</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Authentic Recipes</h3>
              <p className="text-slate-600 leading-relaxed">
                Traditional Indonesian recipes passed down through generations.
              </p>
            </div>

            <div className="card p-8 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Top Rated</h3>
              <p className="text-slate-600 leading-relaxed">
                4.8/5 stars from 500+ happy customers. Quality you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items Preview */}
      <section id="menu" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Popular Dishes</h2>
              <p className="text-xl text-slate-600">Customer favorites you will love</p>
            </div>
            <Link href="/menu" className="btn-primary hidden md:flex">
              View Full Menu
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Nasi Goreng', price: 503.44, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400' },
              { name: 'Rendang Beef', price: 727.44, image: 'https://images.unsplash.com/photo-1645696212791-60ccdb9c99cf?w=400' },
              { name: 'Satay Chicken', price: 615.44, image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=400' },
              { name: 'Gado-Gado', price: 447.44, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' },
            ].map((item, index) => (
              <div key={index} className="card overflow-hidden group cursor-pointer">
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-primary">₱{item.price.toFixed(2)}</span>
                    <button className="bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-lg font-semibold hover:bg-brand-primary hover:text-white transition-all">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Link href="/menu" className="btn-primary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Visit Us Today</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Location</p>
                    <p className="text-slate-600">123 Food Street, Davao City<br />Philippines</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Hours</p>
                    <p className="text-slate-600">Mon - Sun: 11:00 AM - 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Phone</p>
                    <p className="text-slate-600">+63 912 345 6789</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Ready to Order?</h3>
              <p className="text-slate-600 mb-6">Choose your preferred method and start exploring our menu!</p>
              <div className="space-y-4">
                <Link href="/menu?type=delivery" className="block w-full btn-primary text-center">
                  <Bike className="w-5 h-5 inline mr-2" />
                  Order for Delivery
                </Link>
                <Link href="/menu?type=pickup" className="block w-full btn-secondary text-center">
                  <ShoppingBag className="w-5 h-5 inline mr-2" />
                  Order for Pickup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <span className="text-xl">🍜</span>
                </div>
                <span className="text-white font-bold text-lg">Indo Foods</span>
              </div>
              <p className="text-sm">Authentic Indonesian cuisine delivered to your door.</p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Menu</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/menu" className="hover:text-white transition">All Items</Link></li>
                <li><Link href="/menu?category=Main%20Dishes" className="hover:text-white transition">Main Dishes</Link></li>
                <li><Link href="/menu?category=Appetizers" className="hover:text-white transition">Appetizers</Link></li>
                <li><Link href="/menu?category=Desserts" className="hover:text-white transition">Desserts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>&copy; 2024 Indo Foods. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
