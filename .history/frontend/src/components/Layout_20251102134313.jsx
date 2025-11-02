import { motion } from 'framer-motion';
import Header from './Header';

const AnimatedBackground = () => (
  <motion.div
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    }}
    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: -1,
      background: 'linear-gradient(-45deg, #1a4e53, #276d73, #358c92, #4fa5ab)',
      backgroundSize: '400% 400%',
    }}
  />
);

const Layout = ({ children }) => {
  return (
    <>
      <AnimatedBackground />
      <div style={{ minHeight: '100vh', color: 'white' }}>
        <Header />
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
