import { AppBar, Toolbar, Typography, Button, Box, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 font-semibold' : '';
  };

  return (
    <AppBar position="fixed" color="default" elevation={0} className="bg-white border-b border-gray-100">
      <Toolbar className="flex justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" className="font-bold text-blue-600 flex items-center">
            <Link to="/" className="flex items-center no-underline text-inherit">
              <ShowChartIcon className="mr-2" />
              TRADE<span className="text-gray-900">PRO</span>
            </Link>
          </Typography>
        </motion.div>

        <Box className="flex items-center space-x-4">
          <Link to="/" className="no-underline">
            <Button color="inherit" className={`font-medium ${isActive('/')}`}>
              Dashboard
            </Button>
          </Link>
          <Link to="/market" className="no-underline">
            <Button color="inherit" className={`font-medium ${isActive('/market')}`}>
              Market
            </Button>
          </Link>
          <Link to="/portfolio" className="no-underline">
            <Button color="inherit" className={`font-medium ${isActive('/portfolio')}`}>
              Portfolio
            </Button>
          </Link>
          <Link to="/history" className="no-underline">
            <Button color="inherit" className={`font-medium ${isActive('/history')}`}>
              History
            </Button>
          </Link>
          
          <IconButton 
            onClick={handleProfileClick}
            size="small"
            className="ml-2"
          >
            <Avatar className="bg-blue-100 text-blue-600">
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleClose} component={Link} to="/profile">Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;