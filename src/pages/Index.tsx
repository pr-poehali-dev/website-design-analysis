import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Auction {
  id: number;
  title: string;
  description: string;
  currentPrice: number;
  startPrice: number;
  endTime: Date;
  category: string;
  status: 'active' | 'ending' | 'closed';
  bidsCount: number;
  image: string;
}

const mockAuctions: Auction[] = [
  {
    id: 1,
    title: 'Поставка офисного оборудования',
    description: 'Комплект офисного оборудования для муниципального учреждения',
    currentPrice: 2450000,
    startPrice: 3200000,
    endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: 'Оборудование',
    status: 'active',
    bidsCount: 12,
    image: '🖥️'
  },
  {
    id: 2,
    title: 'Строительные материалы',
    description: 'Закупка строительных материалов для дорожного ремонта',
    currentPrice: 5600000,
    startPrice: 7200000,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    category: 'Строительство',
    status: 'ending',
    bidsCount: 24,
    image: '🏗️'
  },
  {
    id: 3,
    title: 'Медицинское оборудование',
    description: 'Оборудование для диагностического центра',
    currentPrice: 8900000,
    startPrice: 12000000,
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: 'Медицина',
    status: 'active',
    bidsCount: 8,
    image: '🏥'
  },
  {
    id: 4,
    title: 'IT-услуги и программное обеспечение',
    description: 'Разработка и внедрение информационной системы',
    currentPrice: 3200000,
    startPrice: 4500000,
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    category: 'IT',
    status: 'active',
    bidsCount: 15,
    image: '💻'
  },
  {
    id: 5,
    title: 'Автотранспорт',
    description: 'Поставка служебных автомобилей',
    currentPrice: 4100000,
    startPrice: 5800000,
    endTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    category: 'Транспорт',
    status: 'ending',
    bidsCount: 19,
    image: '🚗'
  },
  {
    id: 6,
    title: 'Поставка канцелярских товаров',
    description: 'Годовая поставка канцелярии для образовательных учреждений',
    currentPrice: 890000,
    startPrice: 1200000,
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    category: 'Товары',
    status: 'active',
    bidsCount: 7,
    image: '📝'
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTimeRemaining = (endTime: Date) => {
    const diff = endTime.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}д ${hours}ч`;
    if (hours > 0) return `${hours}ч`;
    return 'Завершается';
  };

  const filteredAuctions = mockAuctions.filter(auction => {
    const matchesSearch = auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         auction.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || auction.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Gavel" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ЭТП Гарант</h1>
                <p className="text-xs text-muted-foreground">Электронная торговая площадка</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Торги
              </button>
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Документы
              </button>
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Помощь
              </button>
            </nav>

            <Button variant="outline" className="gap-2">
              <Icon name="User" size={18} />
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="catalog" className="gap-2">
              <Icon name="Grid3x3" size={18} />
              Каталог торгов
            </TabsTrigger>
            <TabsTrigger value="cabinet" className="gap-2">
              <Icon name="User" size={18} />
              Личный кабинет
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-8">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по названию или описанию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[240px] h-12">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="Оборудование">Оборудование</SelectItem>
                    <SelectItem value="Строительство">Строительство</SelectItem>
                    <SelectItem value="Медицина">Медицина</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Транспорт">Транспорт</SelectItem>
                    <SelectItem value="Товары">Товары</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Найдено торгов: <span className="font-semibold text-foreground">{filteredAuctions.length}</span>
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon name="Filter" size={16} />
                    Фильтры
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Icon name="ArrowUpDown" size={16} />
                    Сортировка
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAuctions.map((auction) => (
                <Card key={auction.id} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-4xl">{auction.image}</div>
                      <Badge variant={auction.status === 'ending' ? 'destructive' : 'default'}>
                        {auction.status === 'ending' ? 'Завершается' : 'Активен'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                      {auction.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {auction.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">Текущая цена</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatPrice(auction.currentPrice)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Начальная: {formatPrice(auction.startPrice)}</span>
                        <span className="text-green-600 font-medium">
                          −{Math.round((1 - auction.currentPrice / auction.startPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="Clock" size={16} />
                          <span>{getTimeRemaining(auction.endTime)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Icon name="Users" size={16} />
                          <span>{auction.bidsCount} ставок</span>
                        </div>
                      </div>

                      <Button className="w-full gap-2" size="lg">
                        <Icon name="Eye" size={18} />
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cabinet" className="space-y-8">
            <div className="text-center py-16 space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Icon name="User" size={40} className="text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Личный кабинет</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Войдите в систему, чтобы управлять ставками, отслеживать историю участия и получать уведомления о торгах
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <Button size="lg" className="gap-2">
                  <Icon name="LogIn" size={20} />
                  Войти
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Icon name="UserPlus" size={20} />
                  Регистрация
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon name="Bell" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg">Уведомления</CardTitle>
                  <CardDescription>
                    Отслеживайте изменения в торгах в реальном времени
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon name="History" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg">История</CardTitle>
                  <CardDescription>
                    Полная история участия в торгах и ставок
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Icon name="FileText" size={24} className="text-primary" />
                  </div>
                  <CardTitle className="text-lg">Документы</CardTitle>
                  <CardDescription>
                    Храните и управляйте важными документами
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-white mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">О платформе</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Как это работает</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Преимущества</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Участникам</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Регистрация</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Правила участия</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Поддержка</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Техподдержка</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@etp-garant.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  8 (800) 555-35-35
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2026 ЭТП Гарант. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
