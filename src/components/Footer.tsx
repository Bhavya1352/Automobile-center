import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-2xl font-outfit font-bold text-white">
                                Auto<span className="text-primary">Sphere</span>
                            </span>
                        </div>
                        <p className="text-white/40 leading-relaxed">
                            Precision engineering meets unparalleled service. We are redefining automotive care for the modern performance enthusiast.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Services</h4>
                        <ul className="space-y-4 text-white/40">
                            <li><a href="#" className="hover:text-primary transition-colors">Precision Diagnostics</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Performance Tuning</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Luxury Detailing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Predictive Maintenance</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-white/40">
                            <li><a href="/about" className="hover:text-primary transition-colors">Our Garage</a></li>
                            <li><a href="/technicians" className="hover:text-primary transition-colors">Technicians</a></li>
                            <li><a href="/certifications" className="hover:text-primary transition-colors">Certifications</a></li>
                            <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Subscribe</h4>
                        <p className="text-white/40 mb-4 text-sm">Join our list for technical insights and early bookings.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-white/5 border border-white/10 rounded-l-lg rtl:rounded-l-none rtl:rounded-r-lg px-4 py-2 w-full focus:outline-none focus:border-primary/50 transition-colors"
                                id="footer-email"
                            />
                            <button className="bg-primary hover:bg-primary/90 text-secondary px-4 py-2 rounded-r-lg rtl:rounded-r-none rtl:rounded-l-lg font-bold transition-all">
                                Go
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm text-white/20">
                    <p>© 2026 AutoSphere Technologies. High-Octane Integrity.</p>
                    <div className="flex space-x-6 rtl:space-x-reverse">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
