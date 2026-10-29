import type { Meta, StoryObj } from '@storybook/react';
import { WalletStatus } from '@/components/features/wallet/WalletStatus';

const meta = {
  title: 'Components/Wallet/Status',
  component: WalletStatus,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof WalletStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    // Mock the wallet connection for storybook
    mockData: [
      {
        url: 'api/wallet/status',
        method: 'GET',
        status: 200,
        response: {
          connected: false,
        },
      },
    ],
  },
};

export const Connected: Story = {
  args: {},
  parameters: {
    // Mock the wallet connection for storybook
    mockData: [
      {
        url: 'api/wallet/status',
        method: 'GET',
        status: 200,
        response: {
          connected: true,
          publicKey: '5KKTQ4S8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X',
          walletName: 'Phantom',
          balance: 1.2345,
        },
      },
    ],
  },
};

export const Connecting: Story = {
  args: {},
  parameters: {
    // Mock the wallet connection for storybook
    mockData: [
      {
        url: 'api/wallet/status',
        method: 'GET',
        status: 200,
        response: {
          connecting: true,
          connected: false,
        },
      },
    ],
  },
};

export const Disconnecting: Story = {
  args: {},
  parameters: {
    // Mock the wallet connection for storybook
    mockData: [
      {
        url: 'api/wallet/status',
        method: 'GET',
        status: 200,
        response: {
          disconnecting: true,
          connected: true,
          publicKey: '5KKTQ4S8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X',
          walletName: 'Phantom',
          balance: 1.2345,
        },
      },
    ],
  },
};
