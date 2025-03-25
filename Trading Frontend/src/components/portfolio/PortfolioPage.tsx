import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  alpha,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const GlassCard = styled(Card)(({ theme }) => ({
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

const GlassTableContainer = styled(TableContainer)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginTop: theme.spacing(4)
}));

// Define interface for portfolio data types
interface Position {
  symbol: string;
  quantity: number;
  boughtAt: number | null;
  currentPrice: number;
  investmentValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface PortfolioData {
  userId: string;
  cashBalance: number;
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  positions: Position[];
}

const PortfolioPage: React.FC = () => {
  const theme = useTheme();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hardcodedUrl = 'http://localhost:8084/api/v1/portfolios/356c2c0a-3119-4b6b-ba90-7db6d2909952';

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get(hardcodedUrl);
        setPortfolioData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch portfolio data');
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const getColorForProfitLoss = (value: number) => {
    if (value > 0) return 'success';
    if (value < 0) return 'error';
    return 'default';
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );
  if (error) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography color="error">{error}</Typography>
    </Box>
  );
  if (!portfolioData) return null;

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box my={4}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Portfolio Overview
          </Typography>

          {/* Summary Cards */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <GlassCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Cash Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${portfolioData.cashBalance.toLocaleString()}
                  </Typography>
                </CardContent>
              </GlassCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <GlassCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Total Investment
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${portfolioData.totalInvestment.toLocaleString()}
                  </Typography>
                </CardContent>
              </GlassCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <GlassCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Current Value
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    ${portfolioData.currentValue.toLocaleString()}
                  </Typography>
                </CardContent>
              </GlassCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <GlassCard>
                <CardContent>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Profit/Loss
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Chip 
                      label={`${portfolioData.profitLoss >= 0 ? '+' : ''}${portfolioData.profitLoss.toLocaleString()} (${portfolioData.profitLossPercentage.toFixed(2)}%)`}
                      color={getColorForProfitLoss(portfolioData.profitLoss)}
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        height: 32,
                        backgroundColor: theme => portfolioData.profitLoss >= 0 
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.error.main, 0.1)
                      }}
                    />
                  </Box>
                </CardContent>
              </GlassCard>
            </Grid>
          </Grid>

          {/* Positions Table */}
          <GlassTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Investment Value</TableCell>
                  <TableCell align="right">Current Value</TableCell>
                  <TableCell align="right">Profit/Loss</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolioData.positions.map((position, index) => (
                  <TableRow 
                    key={index}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold">
                        {position.symbol}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{position.quantity}</TableCell>
                    <TableCell align="right">${position.currentPrice.toLocaleString()}</TableCell>
                    <TableCell align="right">${position.investmentValue.toLocaleString()}</TableCell>
                    <TableCell align="right">${position.currentValue.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Chip 
                        size="small"
                        label={`${position.profitLoss >= 0 ? '+' : ''}$${position.profitLoss.toLocaleString()} (${position.profitLossPercentage.toFixed(2)}%)`}
                        color={getColorForProfitLoss(position.profitLoss)}
                        sx={{ 
                          fontWeight: 'medium',
                          backgroundColor: theme => position.profitLoss >= 0 
                            ? alpha(theme.palette.success.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassTableContainer>
        </Box>
      </motion.div>
    </Container>
  );
};

export default PortfolioPage;