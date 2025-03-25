import { Box, Typography, Paper, alpha, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Button, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';

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
  },
  height: '600px',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column'
}));

interface Position {
  id: string;
  stockSymbol: string;
  quantity: number;
  orderType: string;
  price: number;
  userId: string;
  createdAt: string;
  status: string;
}

interface PositionDetail {
  order: Position;
  position: {
    symbol: string;
    quantity: number;
    boughtAt: number | null;
    currentPrice: number;
    investmentValue: number;
    currentValue: number;
    profitLoss: number;
    profitLossPercentage: number;
  };
}

interface ApiError {
  message: string;
}

interface ModalState {
  open: boolean;
  position: PositionDetail | null;
}

interface PositionsTabProps {
  stockSymbol: string;
}

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '600px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const PositionsTab = ({ stockSymbol }: PositionsTabProps) => {
  const theme = useTheme();
  const [modal, setModal] = useState<ModalState>({ open: false, position: null });
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = '356c2c0a-3119-4b6b-ba90-7db6d2909952'; // This should come from auth context

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get<Position[]>(`http://localhost:8085/api/order/users/${userId}`);
        setPositions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch positions');
        console.error('Error fetching positions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [userId]);

  const handlePositionClick = async (position: Position) => {
    try {
      const response = await axios.get<PositionDetail>(
        `http://localhost:8085/api/order/user/position/${position.id}`
      );
      setModal({ open: true, position: response.data });
    } catch (err) {
      console.error('Error fetching position details:', err);
      // Show a basic modal with just the order information if the detailed fetch fails
      const basicPosition: PositionDetail = {
        order: position,
        position: {
          symbol: position.stockSymbol,
          quantity: position.quantity,
          boughtAt: null,
          currentPrice: position.price,
          investmentValue: position.price * position.quantity,
          currentValue: position.price * position.quantity,
          profitLoss: 0.00,
          profitLossPercentage: 0.00
        }
      };
      setModal({ open: true, position: basicPosition });
    }
  };

  return (
    <>
      <GlassCard>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Open Positions
        </Typography>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Order Type</TableCell>
                <TableCell>Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'error.main' }}>
                    {error}
                  </TableCell>
                </TableRow>
              ) : positions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No positions found
                  </TableCell>
                </TableRow>
              ) : positions.map((position) => (
                <TableRow 
                  key={position.id} 
                  onClick={() => handlePositionClick(position)}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) } }}
                >
                  <TableCell>{position.stockSymbol}</TableCell>
                  <TableCell>{position.quantity}</TableCell>
                  <TableCell>{position.orderType}</TableCell>
                  <TableCell>${position.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </GlassCard>

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, position: null })}
      >
        <ModalContent>
          {modal.position && (
            <>
              <Typography variant="h6" gutterBottom>Position Details</Typography>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Order Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Typography>Order ID: {modal.position.order.id}</Typography>
                  <Typography>Symbol: {modal.position.order.stockSymbol}</Typography>
                  <Typography>Quantity: {modal.position.order.quantity}</Typography>
                  <Typography>Order Type: {modal.position.order.orderType}</Typography>
                  <Typography>Price: ${modal.position.order.price.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Position Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Typography>Current Price: ${modal.position.position.currentPrice.toFixed(2)}</Typography>
                  <Typography>Investment Value: ${modal.position.position.investmentValue.toFixed(2)}</Typography>
                  <Typography>Current Value: ${modal.position.position.currentValue.toFixed(2)}</Typography>
                  <Typography sx={{ 
                    color: modal.position.position.profitLoss >= 0 ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 'bold'
                  }}>
                    P/L: ${modal.position.position.profitLoss.toFixed(2)}
                  </Typography>
                  <Typography sx={{ 
                    color: modal.position.position.profitLossPercentage >= 0 ? theme.palette.success.main : theme.palette.error.main,
                    fontWeight: 'bold'
                  }}>
                    P/L %: {modal.position.position.profitLossPercentage >= 0 ? '+' : ''}
                    {modal.position.position.profitLossPercentage.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={() => setModal({ open: false, position: null })}
                >
                  Close
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
};

export default PositionsTab;