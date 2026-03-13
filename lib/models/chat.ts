export enum NutrientKey {
  calories = 'calories',
  protein = 'protein',
  carbs = 'carbs',
  fat = 'fat',
  fiber = 'fiber',
  sugar = 'sugar'
}

export interface NutrientValue {
  key: NutrientKey;
  value: number;
  unit: string;
}

export interface NutritionSummary {
  nutrients: NutrientValue[];
}

export enum MessageSender {
  user = 'user',
  ai = 'ai'
}

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  nutritionSummary?: NutritionSummary;
  fromCache?: boolean;
}

export interface ChatSendRequestDTO {
  userId: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  enabledNutrients: NutrientKey[];
}

export interface ChatSendResponseDTO {
  replyText: string;
  nutritionSummary?: NutritionSummary;
  fromCache?: boolean;
}
