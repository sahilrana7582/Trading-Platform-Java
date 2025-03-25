import { Box, Container, Typography, Card, Grid } from '@mui/material';
import { motion } from 'framer-motion';

const HistoryPage = () => {
  return (
    <Box className="min-h-screen bg-white pt-20">
      <Container maxWidth="xl" className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" className="mb-8 font-bold">
            Transaction History
          </Typography>
          
          <Card className="p-6 mb-8">
            <Typography variant="h5" className="mb-4">
              History Content Coming Soon
            </Typography>
            <Typography variant="body1">
              This is a placeholder for the History page. Here you'll be able to view your past transactions, orders, and trading activity.
            </Typography>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HistoryPage;