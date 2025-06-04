type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  memberSince: string;
  membershipLevel: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

// Mock data for demonstration purposes
// This would be replaced with actual API calls in production
const mockUsers = [
  {
    id: '1',
    email: 'john.doe@example.com',
    password: 'password123', // In real app, passwords wouldn't be stored in plain text
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?u=john',
    memberSince: '2020-05-12',
    membershipLevel: 'Gold'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    password: 'password123',
    name: 'Jane Smith',
    avatar: 'https://i.pravatar.cc/150?u=jane',
    memberSince: '2021-03-24',
    membershipLevel: 'Silver'
  }
];

// This would be replaced by actual API endpoints in production
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    // Generate a fake JWT token
    const token = `mock_jwt_token_${Math.random().toString(36).substring(2)}`;
    
    // Omit password from returned user
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      token,
      user: userWithoutPassword as User
    };
  },
  
  getCurrentUser: async (): Promise<User> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, this would validate the token and return user data
    // For this demo, we'll just return the first mock user
    const { password: _, ...userWithoutPassword } = mockUsers[0];
    
    return userWithoutPassword as User;
  }
};