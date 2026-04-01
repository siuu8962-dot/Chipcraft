// Mock data for ChipCraft education platform

export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  level: 'beginner' | 'intermediate' | 'advanced'
  progress: number
  lessons: Lesson[]
  thumbnail: string
  duration: string
  studentsEnrolled: number
}

export interface Lesson {
  id: string
  title: string
  duration: number
  content: string
  videoUrl: string
  code: string
  codeLanguage: 'c' | 'python' | 'assembly'
  labCode: string
  quiz: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  unlockedAt?: string
}

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Nhập môn STM32 ARM Cortex-M',
    description: 'Học những kiến thức cơ bản về lập trình vi điều khiển STM32 ARM Cortex-M. Từ setup môi trường đến viết code điều khiển GPIO.',
    instructor: 'Nguyễn Minh Tuấn',
    level: 'beginner',
    progress: 65,
    lessons: [
      {
        id: '1-1',
        title: 'Giới thiệu STM32 và ARM Cortex-M',
        duration: 15,
        content: 'Tìm hiểu cấu trúc ARM Cortex-M, các thanh ghi, và cách STM32 sử dụng chúng.',
        videoUrl: 'https://example.com/video1',
        code: `#include "stm32f4xx.h"\n\nvoid SystemInit(void) {\n  RCC_AHB1PeriphClockCmd(RCC_AHB1Periph_GPIOD, ENABLE);\n  GPIO_InitTypeDef GPIO_InitStructure;\n  GPIO_InitStructure.GPIO_Pin = GPIO_Pin_12;\n  GPIO_InitStructure.GPIO_Mode = GPIO_Mode_OUT;\n  GPIO_Init(GPIOD, &GPIO_InitStructure);\n}`,
        codeLanguage: 'c',
        labCode: `// Lab: Blink LED\n// Viết code để LED blinks mỗi 500ms`,
        quiz: [
          {
            id: '1-1-1',
            question: 'ARM Cortex-M có bao nhiêu thanh ghi chính (R0-R15)?',
            options: ['8', '16', '32', '64'],
            correct: 1,
          },
          {
            id: '1-1-2',
            question: 'Từ nào dưới đây là từ khóa trong lập trình STM32?',
            options: ['GPIO_InitTypeDef', 'GPIO_Setup', 'PinConfig', 'InitPin'],
            correct: 0,
          },
        ],
      },
      {
        id: '1-2',
        title: 'Cấu hình GPIO và LED Blink',
        duration: 20,
        content: 'Học cách cấu hình GPIO pins và tạo hiệu ứng LED blink.',
        videoUrl: 'https://example.com/video2',
        code: `#include "stm32f4xx.h"\n#include "delay.h"\n\nvoid GPIO_Config(void) {\n  GPIO_InitTypeDef GPIO_Init;\n  GPIO_Init.GPIO_Pin = GPIO_Pin_12 | GPIO_Pin_13;\n  GPIO_Init.GPIO_Mode = GPIO_Mode_OUT;\n  GPIO_Init.GPIO_Speed = GPIO_Speed_50MHz;\n  GPIO_Init.GPIO_OType = GPIO_OType_PP;\n  GPIO_Init.GPIO_PuPd = GPIO_PuPd_NOPULL;\n  GPIO_Init(GPIOD, &GPIO_Init);\n}\n\nvoid main(void) {\n  GPIO_Config();\n  while(1) {\n    GPIO_SetBits(GPIOD, GPIO_Pin_12);\n    delay_ms(500);\n    GPIO_ResetBits(GPIOD, GPIO_Pin_12);\n    delay_ms(500);\n  }\n}`,
        codeLanguage: 'c',
        labCode: `// Lab: LED Pattern\n// Tạo pattern: blink 3 lần nhanh, tắt 2 giây\n// Dùng for loop + delay`,
        quiz: [
          {
            id: '1-2-1',
            question: 'GPIO_Mode_OUT dùng để làm gì?',
            options: ['Nhập tín hiệu', 'Xuất tín hiệu', 'Ngắt ngoài', 'SPI'],
            correct: 1,
          },
        ],
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    duration: '4 tuần',
    studentsEnrolled: 2341,
  },
  {
    id: '2',
    title: 'UART và Giao tiếp Serial',
    description: 'Thiết lập UART, giao tiếp serial với máy tính, và xử lý dữ liệu nhập xuất.',
    instructor: 'Hoàng Minh Đức',
    level: 'intermediate',
    progress: 40,
    lessons: [
      {
        id: '2-1',
        title: 'Cơ bản UART Protocol',
        duration: 18,
        content: 'Hiểu về UART protocol, baud rate, và handshake signals.',
        videoUrl: 'https://example.com/video3',
        code: `void UART_Init(void) {\n  USART_InitTypeDef USART_InitStructure;\n  USART_InitStructure.USART_BaudRate = 115200;\n  USART_InitStructure.USART_WordLength = USART_WordLength_8b;\n  USART_InitStructure.USART_StopBits = USART_StopBits_1;\n  USART_InitStructure.USART_Parity = USART_Parity_No;\n  USART_InitStructure.USART_Mode = USART_Mode_Rx | USART_Mode_Tx;\n  USART_Init(USART1, &USART_InitStructure);\n  USART_Cmd(USART1, ENABLE);\n}`,
        codeLanguage: 'c',
        labCode: `// Lab: Echo Server\n// Nhận dữ liệu từ UART và gửi lại`,
        quiz: [
          {
            id: '2-1-1',
            question: 'Baud rate 115200 có ý nghĩa gì?',
            options: ['115200 bits/giây', '115200 bytes/giây', '115200 frames/giây', '115200 packets/giây'],
            correct: 0,
          },
        ],
      },
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    duration: '3 tuần',
    studentsEnrolled: 1856,
  },
  {
    id: '3',
    title: 'Timers & PWM',
    description: 'Sử dụng timers, tạo PWM signals, và điều khiển DC motors.',
    instructor: 'Trần Quốc Anh',
    level: 'intermediate',
    progress: 25,
    lessons: [],
    thumbnail: 'https://images.unsplash.com/photo-1516573900055-282a5be94212?w=400&h=300&fit=crop',
    duration: '3 tuần',
    studentsEnrolled: 1543,
  },
  {
    id: '4',
    title: 'Analog to Digital Conversion (ADC)',
    description: 'Làm việc với ADC, đọc analog sensors, và xử lý dữ liệu analog.',
    instructor: 'Lê Minh Tuấn',
    level: 'intermediate',
    progress: 10,
    lessons: [],
    thumbnail: 'https://images.unsplash.com/photo-1553531088-f352156ca4d0?w=400&h=300&fit=crop',
    duration: '4 tuần',
    studentsEnrolled: 1203,
  },
  {
    id: '5',
    title: 'Real-time Operating Systems (RTOS)',
    description: 'Tìm hiểu RTOS, multitasking, và synchronization primitives.',
    instructor: 'Phạm Thu Hương',
    level: 'advanced',
    progress: 0,
    lessons: [],
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-79ab78b540af?w=400&h=300&fit=crop',
    duration: '5 tuần',
    studentsEnrolled: 892,
  },
  {
    id: '6',
    title: 'IoT & Wireless Communication',
    description: 'Wi-Fi, Bluetooth, LoRaWAN - kết nối thiết bị IoT của bạn.',
    instructor: 'Võ Thị Linh',
    level: 'advanced',
    progress: 0,
    lessons: [],
    thumbnail: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
    duration: '6 tuần',
    studentsEnrolled: 756,
  },
]

export const mockAchievements: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'Bắt đầu hành trình',
    description: 'Hoàn thành bài học đầu tiên',
    icon: '🎯',
    progress: 100,
    unlockedAt: '2024-01-15',
  },
  {
    id: 'course-complete',
    title: 'Hoàn thành khóa học',
    description: 'Hoàn thành một khóa học đầy đủ',
    icon: '🏆',
    progress: 65,
  },
  {
    id: 'code-warrior',
    title: 'Chiến binh mã',
    description: 'Viết 50 lần lab code',
    icon: '⚔️',
    progress: 34,
  },
  {
    id: 'quiz-master',
    title: 'Thạc sĩ Quiz',
    description: '100% đúng trên 5 quizzes',
    icon: '🧠',
    progress: 40,
  },
  {
    id: 'streak-week',
    title: 'Tun liên tiếp',
    description: 'Học liên tiếp 7 ngày',
    icon: '🔥',
    progress: 100,
    unlockedAt: '2024-02-10',
  },
  {
    id: 'speed-learner',
    title: 'Người học nhanh',
    description: 'Hoàn thành 3 khóa trong 1 tháng',
    icon: '⚡',
    progress: 33,
  },
]

export const mockUserStats = {
  name: 'Nguyễn Văn Học',
  level: 'Advanced Learner',
  totalPoints: 3450,
  streak: 7,
  coursesCompleted: 2,
  coursesInProgress: 3,
  lessonsCompleted: 24,
  leaderboardRank: 47,
  badges: 5,
}

export const mockLeaderboard = [
  { rank: 1, name: 'Trần Quốc Anh', points: 8920, avatar: '👨‍💻' },
  { rank: 2, name: 'Phạm Thu Hương', points: 8450, avatar: '👩‍💻' },
  { rank: 3, name: 'Lê Minh Tuấn', points: 7890, avatar: '👨‍💻' },
  { rank: 4, name: 'Võ Thị Linh', points: 7250, avatar: '👩‍💻' },
  { rank: 5, name: 'Hoàng Văn Dũng', points: 6830, avatar: '👨‍💻' },
  { rank: 47, name: 'Nguyễn Văn Học', points: 3450, avatar: '👨‍💻', isCurrentUser: true },
]
