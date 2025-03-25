import { Box, Container, Grid, Typography, Paper, Button, useTheme, useMediaQuery, Card } from '@mui/material';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useState } from 'react';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 48, color: '#3B82F6' }} />,
      title: 'Smart Trading',
      description: 'Execute trades with AI-powered insights and real-time market analysis',
      color: 'bg-blue-50'
    },
    {
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 48, color: '#8B5CF6' }} />,
      title: 'Portfolio Management',
      description: 'Advanced portfolio tracking with risk assessment and diversification metrics',
      color: 'bg-purple-50'
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 48, color: '#10B981' }} />,
      title: 'Advanced Analytics',
      description: 'Professional-grade charts and technical analysis tools',
      color: 'bg-green-50'
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 48, color: '#F59E0B' }} />,
      title: 'Transaction History',
      description: 'Comprehensive order history with detailed performance analytics',
      color: 'bg-amber-50'
    }
  ];

  return (
    <Box className="min-h-screen bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOGZhZmMiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

      <Container maxWidth="xl" className="relative pt-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20"
        >
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h1" 
                  className="text-5xl md:text-7xl font-bold mb-6 text-gray-900"
                >
                  <span className="text-blue-600">Smart</span> Trading Platform
                </Typography>
                <Typography variant="h5" className="text-gray-600 mb-8 font-light">
                  Experience the next generation of trading with advanced AI insights and real-time analytics
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    className="bg-blue-600 hover:bg-blue-700 py-3 px-8 text-lg shadow-lg shadow-blue-200"
                  >
                    Start Trading Now
                  </Button>
                </motion.div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <Card elevation={8} className="overflow-hidden rounded-2xl shadow-xl">
                  <div className="aspect-video bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <img 
                      src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                      alt="Trading Dashboard" 
                      className="w-full h-full object-cover rounded-lg shadow-inner"
                      onError={(e) => {
                        e.currentTarget.src = "/assets/images/trading-dashboard.jpg";
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Features Section */}
        <div className="py-20">
          <Typography variant="h3" className="text-center mb-4 font-bold text-gray-900">
            Professional Trading Tools
          </Typography>
          <Typography variant="h6" className="text-center mb-16 text-gray-500 font-light">
            Everything you need to succeed in today's financial markets
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="h-full"
                >
                  <Card 
                    elevation={hoveredCard === index ? 8 : 2}
                    className="h-full transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className={`${feature.color} p-8 h-full flex flex-col`}>
                      <div className="mb-6">
                        {feature.icon}
                      </div>
                      <Typography variant="h5" className="mb-4 font-bold text-gray-900">
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" className="text-gray-600">
                        {feature.description}
                      </Typography>
                    </div>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </div>

        {/* Market Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20"
        >
          <Card elevation={4} className="overflow-hidden rounded-2xl border border-gray-100">
            <Box className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600"></Box>
            <Box className="p-10">
              <Typography variant="h4" className="mb-10 text-center font-bold text-gray-900">
                Live Market Overview
              </Typography>
              <Grid container spacing={6}>
                {[
                  { name: 'NASDAQ', value: '+2.45%', color: 'text-green-600', change: '↑' },
                  { name: 'S&P 500', value: '-0.82%', color: 'text-red-600', change: '↓' },
                  { name: 'DOW', value: '+1.23%', color: 'text-green-600', change: '↑' },
                  { name: 'CRYPTO', value: '+5.67%', color: 'text-green-600', change: '↑' }
                ].map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="text-center"
                    >
                      <Typography variant="h3" className={`${stat.color} font-bold mb-2`}>
                        {stat.value} <span className="text-xl">{stat.change}</span>
                      </Typography>
                      <Typography variant="h6" className="text-gray-500">
                        {stat.name}
                      </Typography>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-20"
        >
          <Card className="overflow-hidden rounded-2xl">
            <Box className="p-16 bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
              <Typography variant="h3" className="mb-6 font-bold text-gray-900">
                Ready to Transform Your Trading?
              </Typography>
              <Typography variant="h6" className="mb-8 text-gray-600 max-w-2xl mx-auto">
                Join thousands of successful traders who have already taken their trading to the next level
              </Typography>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700 py-3 px-10 text-lg shadow-lg shadow-blue-200"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </Box>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HomePage;