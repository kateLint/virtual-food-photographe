
export enum PhotoStyle {
  RUSTIC = 'Rustic/Dark',
  MODERN = 'Bright/Modern',
  SOCIAL = 'Social Media',
}

export interface Dish {
  id: string;
  name: string;
  imageUrl: string | null;
  status: 'pending' | 'generating' | 'completed' | 'failed';
}
