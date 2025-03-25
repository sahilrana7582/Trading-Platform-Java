import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Typography, Grid, Paper, IconButton, Button,
  Avatar, Chip, useTheme, alpha, LinearProgress,
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer
} from '@mui/material';
import OrderForm from './OrderForm';
import { 
  ArrowBack, TrendingUp, TrendingDown, ShowChart, 
  BarChart, Timeline, Article,
  ArrowUpward,
  ArrowDownwardOutlined
} from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Bar, ComposedChart } from 'recharts';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import websocketService from '../../services/websocketService';
import PositionsTab from './PositionsTab';

// Styled components
const GlassCard = styled(Paper)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

interface StockData {
  'Stock Name': string;
  symbol: string;
  price: string;
  previousPrice?: string;
  priceChange?: number;
  favorite?: boolean;
}

interface PricePoint {
  timestamp: number;
  price: number;
}

// Add this function at the top of your component
const loadStoredPriceHistory = (symbol: string) => {
  const stored = localStorage.getItem(`priceHistory-${symbol}`);
  return stored ? JSON.parse(stored) : [];
};

// Add mock data interfaces
interface MockStockData {
  'Stock Name': string;
  symbol: string;
  price: string;
  previousPrice: string;
  priceChange: number;
  favorite: boolean;
  dayRange: { low: number; high: number };
  volume: string;
  marketCap: string;
  peRatio: number;
  sector: string;
  exchange: string;
}

interface MockTechnicalData {
  rsi: number;
  macd: string;
  sma20: number;
  sma50: number;
}

interface MockNewsItem {
  headline: string;
  timestamp: number;
  source: string;
}

// Add mock data generator
const generateMockData = (symbol: string | undefined): MockStockData => {
  const basePrice = Math.floor(Math.random() * 500) + 50;
  const previousPrice = basePrice - (Math.random() * 10 - 5);
  const priceChange = ((basePrice - previousPrice) / previousPrice) * 100;
  
  return {
    'Stock Name': symbol === 'AAPL' ? 'Apple Inc.' : 
                  symbol === 'MSFT' ? 'Microsoft Corporation' : 
                  symbol === 'GOOGL' ? 'Alphabet Inc.' : 
                  symbol === 'AMZN' ? 'Amazon.com Inc.' : 
                  symbol === 'TSLA' ? 'Tesla, Inc.' : 'Demo Company',
    symbol: symbol || 'DEMO',
    price: basePrice.toFixed(2),
    previousPrice: previousPrice.toFixed(2),
    priceChange: parseFloat(priceChange.toFixed(2)),
    favorite: Math.random() > 0.5,
    dayRange: { 
      low: basePrice - (Math.random() * 10), 
      high: basePrice + (Math.random() * 10) 
    },
    volume: `${(Math.random() * 10 + 1).toFixed(1)}M`,
    marketCap: `$${(Math.random() * 1000 + 100).toFixed(1)}B`,
    peRatio: parseFloat((Math.random() * 50 + 10).toFixed(1)),
    sector: ['Technology', 'Healthcare', 'Finance', 'Consumer Goods', 'Energy'][Math.floor(Math.random() * 5)],
    exchange: ['NASDAQ', 'NYSE', 'LSE', 'TSE'][Math.floor(Math.random() * 4)]
  };
};

const generateMockTechnicalData = (): MockTechnicalData => {
  const rsi = Math.floor(Math.random() * 100);
  const macdValue = Math.random() > 0.5 ? 'Bullish' : 'Bearish';
  
  return {
    rsi,
    macd: macdValue,
    sma20: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    sma50: parseFloat((Math.random() * 500 + 50).toFixed(2))
  };
};

const generateMockNews = (stockName: string): MockNewsItem[] => {
  const news = [
    {
      headline: `${stockName} Reports Strong Q2 Earnings, Beats Expectations`,
      timestamp: Date.now() - 3600000,
      source: 'Financial Times'
    },
    {
      headline: `Analysts Upgrade ${stockName} to "Buy" Rating`,
      timestamp: Date.now() - 7200000,
      source: 'Wall Street Journal'
    },
    {
      headline: `${stockName} Announces New Product Line, Shares Jump`,
      timestamp: Date.now() - 10800000,
      source: 'Bloomberg'
    },
    {
      headline: `${stockName} CEO Discusses Future Growth Strategy`,
      timestamp: Date.now() - 14400000,
      source: 'CNBC'
    }
  ];
  
  return news;
};

// Generate mock price history
const generateMockPriceHistory = (basePrice: number, count: number): PricePoint[] => {
  const points: PricePoint[] = [];
  const now = Date.now();
  
  for (let i = count; i >= 0; i--) {
    // Create some volatility in the price
    const volatility = Math.random() * 0.06 - 0.03; // -3% to +3%
    const price = basePrice * (1 + volatility);
    
    points.push({
      timestamp: now - (i * 60000), // Every minute
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return points;
};

// Fix the formatPrice function
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Create hardcoded demo data based on the symbol
  const hardcodedStockData: StockData = {
    'Stock Name': symbol === 'AAPL' ? 'Apple Inc.' : 
                  symbol === 'MSFT' ? 'Microsoft Corporation' : 
                  symbol === 'GOOGL' ? 'Alphabet Inc.' : 
                  symbol === 'AMZN' ? 'Amazon.com Inc.' : 
                  symbol === 'TSLA' ? 'Tesla, Inc.' : 'Demo Company',
    symbol: symbol || 'DEMO',
    price: '156.78',
    previousPrice: '154.32',
    priceChange: 1.59,
    favorite: true
  };
  
  // Create hardcoded price history
  const basePrice = parseFloat(hardcodedStockData.price);
  const hardcodedPriceHistory: PricePoint[] = Array.from({ length: 60 }, (_, i) => {
    const volatility = (Math.random() * 0.06) - 0.03; // -3% to +3%
    return {
      timestamp: Date.now() - ((60 - i) * 60000), // Every minute for the past hour
      price: parseFloat((basePrice * (1 + volatility)).toFixed(2))
    };
  });
  
  // Create hardcoded technical data
  const hardcodedTechnicalData: MockTechnicalData = {
    rsi: 62.5,
    macd: 'Bullish',
    sma20: basePrice - 2.34,
    sma50: basePrice - 5.67
  };
  
  // Create hardcoded news
  const hardcodedNews: MockNewsItem[] = [
    {
      headline: `${hardcodedStockData['Stock Name']} Reports Strong Q2 Earnings, Beats Expectations`,
      timestamp: Date.now() - 3600000,
      source: 'Financial Times'
    },
    {
      headline: `Analysts Upgrade ${hardcodedStockData['Stock Name']} to "Buy" Rating`,
      timestamp: Date.now() - 7200000,
      source: 'Wall Street Journal'
    },
    {
      headline: `${hardcodedStockData['Stock Name']} Announces New Product Line, Shares Jump`,
      timestamp: Date.now() - 10800000,
      source: 'Bloomberg'
    },
    {
      headline: `${hardcodedStockData['Stock Name']} CEO Discusses Future Growth Strategy`,
      timestamp: Date.now() - 14400000,
      source: 'CNBC'
    }
  ];
  
  // Use state with hardcoded initial values
  const [stockData, setStockData] = useState<StockData>(hardcodedStockData);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>(hardcodedPriceHistory);
  const [loading, setLoading] = useState(false); // Set to false initially
  const [startPrice, setStartPrice] = useState<number | null>(basePrice);
  const [timeframe, setTimeframe] = useState<number>(5);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [activeTab, setActiveTab] = useState(0);


  // Single getFilteredData function
  const getFilteredData1 = () => {
    if (priceHistory.length === 0) return [];
    
    const currentTime = Date.now();
    const cutoffTime = currentTime - (timeframe * 60 * 1000);
    
    return priceHistory
      .filter(point => point.timestamp >= cutoffTime)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // Single useEffect for websocket
  useEffect(() => {
    const subscription = websocketService.subscribe('/topic/stock-updates', (message) => {
      try {
        const data: StockData = typeof message === 'string' 
          ? JSON.parse(message.replace(/'/g, '"')) 
          : message;
        
        if (data.symbol === symbol) {
          setStockData(data);
          
          const currentPrice = parseFloat(data.price);
          const currentTime = Date.now();
          
          if (startPrice === null) {
            setStartPrice(currentPrice);
          }
          
          setPriceHistory(prev => {
            const newPoint = {
              timestamp: currentTime,
              price: currentPrice
            };
            
            const oneHourAgo = currentTime - 3600000;
            const filteredHistory = [...prev.filter(point => point.timestamp >= oneHourAgo), newPoint];
            
            localStorage.setItem(`priceHistory-${symbol}`, JSON.stringify(filteredHistory));
            
            return filteredHistory;
          });
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error processing stock data:', error);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [symbol, startPrice]);

  // Add timeframe options
  const timeframeOptions = [
    { label: '5M', value: 5 },
    { label: '10M', value: 10 },
    { label: '30M', value: 30 },
    { label: '60M', value: 60 }
  ];

  // Add this function to filter data based on selected timeframe
  const getFilteredData = () => {
    if (priceHistory.length === 0) return [];
    
    const currentTime = Date.now();
    const cutoffTime = currentTime - (timeframe * 60 * 1000);
    
    return priceHistory
      .filter(point => point.timestamp >= cutoffTime)
      .sort((a, b) => a.timestamp - b.timestamp);
  };

  // Add state for mock data
    const [mockTechnicalData, setMockTechnicalData] = useState<MockTechnicalData>(generateMockTechnicalData());
    const [mockNews, setMockNews] = useState<MockNewsItem[]>([]);
  
  // Modify the useEffect to include a timeout for mock data
  useEffect(() => {
    // Try to get data from websocket
    const subscription = websocketService.subscribe('/topic/stock-updates', (message) => {
      try {
        const data: StockData = typeof message === 'string' 
          ? JSON.parse(message.replace(/'/g, '"')) 
          : message;
        
        if (data.symbol === symbol) {
          setStockData(data);
          
          const currentPrice = parseFloat(data.price);
          
          if (startPrice === null) {
            setStartPrice(currentPrice);
          }
          
          setPriceHistory(prev => {
            const newPoint = {
              timestamp: Date.now(),
              price: currentPrice
            };
            
            // Keep last 25 points for the chart
            return [...prev, newPoint].slice(-25);
          });
          
          setLoading(false);
        }
      } catch (error) {
        console.error('Error processing stock data:', error);
      }
    });
  
    // Add timeout to load mock data if websocket doesn't respond
    const mockDataTimeout = setTimeout(() => {
      if (loading) {
        console.log('Loading mock data for', symbol);
        const mockData = generateMockData(symbol);
        setStockData(mockData as StockData);
        
        const basePrice = parseFloat(mockData.price);
        if (startPrice === null) {
          setStartPrice(basePrice);
        }
        
        // Generate mock price history
        const mockHistory = generateMockPriceHistory(basePrice, 60);
        setPriceHistory(mockHistory);
        
        // Generate mock technical data and news
        setMockTechnicalData(generateMockTechnicalData());
        setMockNews(generateMockNews(mockData['Stock Name']));
        
        setLoading(false);
      }
    }, 1000); // Wait 1 second before loading mock data
  
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
      clearTimeout(mockDataTimeout);
    };
  }, [symbol, startPrice, loading]);
  
  // Also fix the loading condition in the return statement
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              mr: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            {symbol} Stock Details
          </Typography>
        </Box>

        {loading ? (
          <LinearProgress />
        ) : stockData && (
          <>
            {/* Stock Header Card */}
            <GlassCard sx={{ mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: 'white',
                        color: '#1565c0',
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        mr: 2
                      }}
                    >
                      {stockData['Stock Name'][0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h3" fontWeight="bold">
                        {stockData['Stock Name']}
                      </Typography>
                      <Chip
                        label={stockData.symbol}
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          fontWeight: 'bold',
                          mt: 1
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h2" fontWeight="bold">
                      ${Number(stockData.price).toFixed(2)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
                      {stockData.priceChange && stockData.priceChange > 0 ? (
                        <TrendingUp sx={{ mr: 1 }} />
                      ) : (
                        <TrendingDown sx={{ mr: 1 }} />
                      )}
                      <Typography variant="h5" fontWeight="bold">
                        {stockData.priceChange ? (stockData.priceChange > 0 ? '+' : '') + stockData.priceChange.toFixed(2) : '0.00'}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </GlassCard>

            {/* Trading View Style Chart with timeframe options */}
            <GlassCard sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" fontWeight="bold" sx={{ mr: 2 }}>
                    Price Chart
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={chartType === 'line' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setChartType('line')}
                      sx={{ minWidth: '60px', borderRadius: '8px' }}
                    >
                      Line
                    </Button>
                    <Button
                      variant={chartType === 'bar' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setChartType('bar')}
                      sx={{ minWidth: '60px', borderRadius: '8px' }}
                    >
                      Bar
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {timeframeOptions.map(option => (
                    <Button
                      key={option.value}
                      variant={timeframe === option.value ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setTimeframe(option.value)}
                      sx={{
                        minWidth: '60px',
                        borderRadius: '8px',
                        fontWeight: 'bold'
                      }}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Box>
              </Box>
              <Box sx={{ height: 500 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={getFilteredData1()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.2)} />
                      <XAxis 
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => {
                          const date = new Date(timestamp);
                          return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        }}
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <RechartsTooltip
                        labelFormatter={(timestamp) => {
                          const date = new Date(timestamp);
                          return `Time: ${date.toLocaleTimeString()}`;
                        }}
                        formatter={(value) => [`$${value}`, 'Price']}
                        contentStyle={{
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                          boxShadow: theme.shadows[3]
                        }}
                      />
                      {startPrice && (
                        <ReferenceLine 
                          y={startPrice} 
                          stroke={theme.palette.grey[500]} 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: `$${formatPrice(startPrice)}`, 
                            position: 'right',
                            fill: theme.palette.text.secondary,
                            fontSize: 12
                          }} 
                        />
                      )}
                      <Line 
                        type="monotone"
                        dataKey="price"
                        stroke={theme.palette.primary.main}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  ) : (
                    <ComposedChart data={getFilteredData()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.secondary, 0.2)} />
                      <XAxis 
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => {
                          const date = new Date(timestamp);
                          return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                        }}
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        stroke={theme.palette.text.secondary}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${formatPrice(value)}`}
                      />
                      <RechartsTooltip
                        labelFormatter={(timestamp) => {
                          const date = new Date(timestamp);
                          return `Time: ${date.toLocaleTimeString()}`;
                        }}
                        formatter={(value) => [`$${formatPrice(Number(value))}`, 'Price']}
                        contentStyle={{
                          backgroundColor: alpha(theme.palette.background.paper, 0.9),
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 8,
                          boxShadow: theme.shadows[3]
                        }}
                      />
                      {startPrice && (
                        <ReferenceLine 
                          y={startPrice} 
                          stroke={theme.palette.grey[500]} 
                          strokeDasharray="3 3" 
                          label={{ 
                            value: `$${formatPrice(startPrice)}`, 
                            position: 'right',
                            fill: theme.palette.text.secondary,
                            fontSize: 12
                          }} 
                        />
                      )}
                      <Bar 
                        dataKey="price"
                        fill={theme.palette.primary.main}
                        isAnimationActive={false}
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </GlassCard>

            {/* Live Price Change Table */}
            <TableContainer 
              component={Paper} 
              elevation={0}
              sx={{ 
                mb: 4,
                borderRadius: 2,
                overflow: 'auto',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.7),
                maxHeight: 400,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ 
                    background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
                    height: '64px',
                    '& .MuiTableCell-root': {
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      borderBottom: 'none',
                    }
                  }}>
                    <TableCell width="25%" sx={{ pl: 3, fontWeight: 'bold', borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Stock Name</TableCell>
                    <TableCell width="10%" sx={{ pl: 2, fontWeight: 'bold', borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Symbol</TableCell>
                    <TableCell width="15%" align="right" sx={{ fontWeight: 'bold', pr: 3, borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Previous</TableCell>
                    <TableCell width="15%" align="right" sx={{ fontWeight: 'bold', pr: 3, borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Current</TableCell>
                    <TableCell width="15%" align="right" sx={{ fontWeight: 'bold', pr: 3, borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>Change</TableCell>
                    <TableCell width="20%" align="right" sx={{ fontWeight: 'bold', pr: 3 }}>Last Updated</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {priceHistory.slice().reverse().map((point, index) => {
                    const prevPrice = index < priceHistory.length - 1 
                      ? priceHistory[priceHistory.length - index - 2].price 
                      : point.price;
                    const priceChange = ((point.price - prevPrice) / prevPrice) * 100;
                    const isPositive = priceChange >= 0;

                    return (
                      <TableRow 
                        key={point.timestamp}
                        sx={{
                          height: '60px',
                          cursor: 'pointer',
                          '&:nth-of-type(odd)': {
                            backgroundColor: alpha(theme.palette.background.default, 0.4),
                          },
                          '& td': {
                            transition: 'background-color 0.3s',
                            backgroundColor: isPositive
                              ? alpha(theme.palette.success.main, 0.05)
                              : alpha(theme.palette.error.main, 0.05)
                          },
                          '&:hover td': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: theme.palette.primary.main,
                                color: 'white',
                                fontWeight: 'bold',
                                mr: 2
                              }}
                            >
                              {stockData['Stock Name'][0]}
                            </Avatar>
                            <Typography variant="body1" fontWeight="medium">
                              {stockData['Stock Name']}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={stockData.symbol} 
                            size="small"
                            sx={{ 
                              fontWeight: 'bold',
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main
                            }} 
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            ${formatPrice(prevPrice)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold">
                            ${formatPrice(point.price)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {isPositive ? (
                              <TrendingUp sx={{ color: 'success.main', mr: 1 }} fontSize="small" />
                            ) : (
                              <TrendingDown sx={{ color: 'error.main', mr: 1 }} fontSize="small" />
                            )}
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={isPositive ? 'success.main' : 'error.main'}
                            >
                              {Math.abs(priceChange).toFixed(2)}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {new Date(point.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Order Form and Positions side by side */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Box sx={{ flex: 1 }}>
                <OrderForm 
                  stockSymbol={stockData.symbol}
                  currentPrice={parseFloat(stockData.price)}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <PositionsTab stockSymbol={stockData.symbol} />
              </Box>
            </Box>
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default StockDetailPage;

  <Grid container spacing={3}>
    
  </Grid>
