  import { useContext } from 'react';
  import { AuthContext } from '../context/AuthContext';
  import Navbar from '../components/Navbar';

  const Dashboard = () => {
      const { user } = useContext(AuthContext);

      return (
          <div className="min-h-screen bg-[var(--color-cream)]">
              <Navbar />
              <div className="container mx-auto px-8 py-12">
                  <h1 className="font-serif text-5xl font-semibold text-[var(--color-charcoal)] mb-12">Dashboard</h1>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Summary Cards */}
                      <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm
  hover:shadow-md transition-shadow duration-300">
                          <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Total
  Projects</h3>
                          <p className="font-serif text-5xl font-bold text-[var(--color-charcoal)]">0</p>
                      </div>

                      <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm
  hover:shadow-md transition-shadow duration-300">
                          <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Total
  Income</h3>
                          <p className="font-serif text-5xl font-bold text-[var(--color-forest-green)]">$0.00</p>
                      </div>

                      <div className="bg-[var(--color-off-white)] p-8 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm
  hover:shadow-md transition-shadow duration-300">
                          <h3 className="text-[var(--color-warm-gray)] text-xs font-semibold uppercase tracking-widest mb-4">Total
  Expenses</h3>
                          <p className="font-serif text-5xl font-bold text-[var(--color-terracotta)]">$0.00</p>
                      </div>
                  </div>

                  <div className="mt-12 bg-[var(--color-off-white)] p-10 rounded-sm border border-[var(--color-warm-gray)]/20 shadow-sm">        
                      <h2 className="font-serif text-3xl font-semibold text-[var(--color-charcoal)] mb-4">Welcome back, {user?.name}</h2>        
                      <p className="text-[var(--color-warm-gray)] text-lg leading-relaxed">
                          Start by creating your first project from the Projects page.
                      </p>
                  </div>
              </div>
          </div>
      );
  };

  export default Dashboard;