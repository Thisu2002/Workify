import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Stack,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Notifications,
  Business,
  School,
  Settings,
  Delete,
  MarkEmailRead
} from '@mui/icons-material';

const NotificationDropdown = () => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  
  // Sample notifications with color coding (only for candidates)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Job Application',
      message: 'You have a new application for Software Developer position',
      time: '2 minutes ago',
      read: false,
      source: 'recruiter' // Blue
    },
    {
      id: 2,
      title: 'Mentor Session Reminder',
      message: 'Your mentoring session starts in 30 minutes',
      time: '5 minutes ago',
      read: false,
      source: 'mentor' // Green
    },
    {
      id: 3,
      title: 'Profile Update Required',
      message: 'Please update your profile information',
      time: '1 hour ago',
      read: true,
      source: 'system' // Orange
    },
    {
      id: 4,
      title: 'Interview Scheduled',
      message: 'Tech Corp has scheduled an interview for tomorrow at 2 PM',
      time: '3 hours ago',
      read: false,
      source: 'recruiter' // Blue
    }
  ]);

  const notificationOpen = Boolean(notificationAnchorEl);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationOpen = (event) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchorEl(null);

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (source) => {
    switch(source) {
      case 'recruiter':
        return <Business sx={{ color: '#1976d2', fontSize: 20 }} />; // Blue
      case 'mentor':
        return <School sx={{ color: '#2e7d32', fontSize: 20 }} />; // Green  
      case 'system':
        return <Settings sx={{ color: '#f57c00', fontSize: 20 }} />; // Orange
      default:
        return <Notifications sx={{ color: '#1976d2', fontSize: 20 }} />;
    }
  };

  return (
    <>
      {/* Notification Button */}
      <IconButton
        size="large"
        onClick={handleNotificationOpen}
        sx={{ 
          color: 'primary.main',
          '&:hover': { 
            backgroundColor: 'transparent'
          }
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <Notifications sx={{ fontSize: 32, color: 'primary.main' }} />
        </Badge>
      </IconButton>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={notificationOpen}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { 
            width: 350,
            maxHeight: 400
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <MenuItem 
                onClick={handleMarkAllAsRead}
                sx={{ p: 0.5, fontSize: '0.875rem' }}
              >
                <MarkEmailRead fontSize="small" sx={{ mr: 0.5 }} />
                Mark all as read
              </MenuItem>
            )}
          </Stack>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              sx={{ 
                p: 2,
                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                borderBottom: 1,
                borderColor: 'divider',
                alignItems: 'flex-start',
                whiteSpace: 'normal',
                '&:hover': {
                  backgroundColor: 'action.selected'
                }
              }}
              onClick={() => handleMarkAsRead(notification.id)}
            >
              <ListItemIcon sx={{ mt: 0.5 }}>
                {getNotificationIcon(notification.source)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={notification.read ? 'normal' : 'bold'}
                      sx={{ flex: 1 }}
                    >
                      {notification.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Stack>
                }
                secondary={
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {notification.message}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      fontWeight={notification.read ? 'normal' : 'bold'}
                    >
                      {notification.time}
                    </Typography>
                  </Box>
                }
              />
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationDropdown;
