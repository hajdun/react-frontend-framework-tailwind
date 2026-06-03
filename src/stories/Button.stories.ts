import { fn } from 'storybook/test'
import Button from '../components/Button'

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    children: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: { onClick: fn() },
}

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Log Workout',
  },
}

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
}

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'View all',
  },
}

export const Large = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Start Workout',
  },
}

export const Small = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: '+ Add Meal',
  },
}

export const Disabled = {
  args: {
    variant: 'primary',
    children: 'Unavailable',
    disabled: true,
  },
}