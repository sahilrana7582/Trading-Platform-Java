import { Box, Container, Typography, Card, Grid, Avatar, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const ProfilePage = () => {
  return (
    <Box className="min-h-screen bg-white pt-20">
      <Container maxWidth="xl" className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" className="mb-8 font-bold">
            Your Profile
          </Typography>
          
          <Card className="p-6 mb-8">
            <Box className="flex items-center mb-6">
              <Avatar sx={{ width: 80, height: 80 }} className="bg-blue-100 text-blue-600 mr-4">
                <AccountCircleIcon sx={{ fontSize: 60 }} />
              </Avatar>
              <Box>
                <Typography variant="h4">John Doe</Typography>
                <Typography variant="body1" className="text-gray-500">john.doe@example.com</Typography>
              </Box>
            </Box>
            
            <Divider className="my-4" />
            
            <Typography variant="h5" className="mb-4">
              Profile Content Coming Soon
            </Typography>
            <Typography variant="body1">
              This is a placeholder for the Profile page. Here you'll be able to manage your account settings, preferences, and personal information.
            </Typography>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProfilePage;