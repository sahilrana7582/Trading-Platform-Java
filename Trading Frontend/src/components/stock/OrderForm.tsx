import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  alpha,
  Paper,
  styled
} from '@mui/material';

const GlassCard = styled(Paper)(({ theme }) => ({
  backdropFilter: 'blur(10px)',
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  transition: 'transform 0.3s, box-shadow 0.3s',
  height: '600px',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

interface OrderFormProps {
  stockSymbol: string;
  currentPrice: number;
}

const OrderForm = ({ stockSymbol, currentPrice }: OrderFormProps) => {
  const theme = useTheme();
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState<string>('');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const handleOrderSideChange = (event: React.MouseEvent<HTMLElement>, newOrderSide: 'buy' | 'sell') => {
    if (newOrderSide !== null) {
      setOrderSide(newOrderSide);
    }
  };

  const handleOrderTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOrderType(event.target.value as 'market' | 'limit');
    if (event.target.value === 'market') {
      setLimitPrice('');
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setQuantity(value);
    }
  };

  const handleLimitPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setLimitPrice(value);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/order/place/356c2c0a-3119-4b6b-ba90-7db6d2909952', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockSymbol,
          quantity: parseInt(quantity),
          orderType: orderSide.toUpperCase(),
          price: orderType === 'limit' ? parseFloat(limitPrice) : currentPrice
        })
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);
      // Reset form
      setQuantity('');
      setLimitPrice('');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const isValidOrder = () => {
    if (!quantity || parseInt(quantity) <= 0) return false;
    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) return false;
    return true;
  };

  const calculateTotal = () => {
    if (!quantity) return 0;
    const price = orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : currentPrice;
    return (parseInt(quantity) * price).toFixed(2);
  };

  return (
    <GlassCard>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Place Order
      </Typography>

      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={orderSide}
          exclusive
          onChange={handleOrderSideChange}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton 
            value="buy"
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.success.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.success.dark
                }
              }
            }}
          >
            Buy
          </ToggleButton>
          <ToggleButton 
            value="sell"
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.error.main,
                color: 'white',
                '&:hover': {
                  backgroundColor: theme.palette.error.dark
                }
              }
            }}
          >
            Sell
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Order Type</InputLabel>
          <Select
            value={orderType}
            label="Order Type"
            onChange={handleOrderTypeChange}
          >
            <MenuItem value="market">Market Order</MenuItem>
            <MenuItem value="limit">Limit Order</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Quantity"
          value={quantity}
          onChange={handleQuantityChange}
          type="text"
          sx={{ mb: 2 }}
          error={quantity !== '' && parseInt(quantity) <= 0}
          helperText={quantity !== '' && parseInt(quantity) <= 0 ? 'Please enter a valid quantity' : ''}
        />

        {orderType === 'limit' && (
          <TextField
            fullWidth
            label="Limit Price"
            value={limitPrice}
            onChange={handleLimitPriceChange}
            type="text"
            sx={{ mb: 2 }}
            error={limitPrice !== '' && parseFloat(limitPrice) <= 0}
            helperText={limitPrice !== '' && parseFloat(limitPrice) <= 0 ? 'Please enter a valid price' : ''}
          />
        )}

        <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Order Summary
          </Typography>
          <Typography variant="body1">
            {orderSide === 'buy' ? 'Buying' : 'Selling'} {quantity || '0'} shares of {stockSymbol}
            at {orderType === 'limit' ? `$${limitPrice || '0.00'}` : `$${currentPrice.toFixed(2)}`}
            = ${calculateTotal()}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!isValidOrder()}
          sx={{
            height: 48,
            backgroundColor: orderSide === 'buy' ? theme.palette.success.main : theme.palette.error.main,
            '&:hover': {
              backgroundColor: orderSide === 'buy' ? theme.palette.success.dark : theme.palette.error.dark
            }
          }}
        >
          {orderSide === 'buy' ? 'Buy' : 'Sell'} {stockSymbol}
        </Button>
      </Box>
    </GlassCard>
  );
};

export default OrderForm;