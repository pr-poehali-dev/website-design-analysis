import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
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
  organizerName: string;
  organizerInn: string;
  lotNumber: string;
  minStep: number;
  specifications: string;
  deliveryTerms: string;
  paymentTerms: string;
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
    image: '🖥️',
    organizerName: 'ГКУ "Центр закупок города Москвы"',
    organizerInn: '7701234567',
    lotNumber: 'ЭА-2026-001234',
    minStep: 50000,
    specifications: 'Компьютеры персональные - 25 шт., Мониторы LCD 24" - 25 шт., Принтеры лазерные - 5 шт., МФУ - 3 шт., Сетевое оборудование - комплект',
    deliveryTerms: 'Поставка в течение 30 календарных дней с момента заключения договора. Место поставки: г. Москва, ул. Тверская, д. 13',
    paymentTerms: 'Оплата производится в течение 30 банковских дней после подписания акта приема-передачи'
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
    image: '🏗️',
    organizerName: 'Департамент строительства',
    organizerInn: '7702345678',
    lotNumber: 'ЭА-2026-002345',
    minStep: 100000,
    specifications: 'Асфальтобетонная смесь - 500 тонн, Щебень фракция 5-20 - 200 м³, Песок строительный - 150 м³, Бордюрный камень - 1000 м.п.',
    deliveryTerms: 'Поставка партиями в течение 60 календарных дней. Место поставки: г. Санкт-Петербург, складская база заказчика',
    paymentTerms: 'Поэтапная оплата после приемки каждой партии в течение 15 банковских дней'
  }
];

interface BidHistory {
  id: number;
  participant: string;
  price: number;
  time: Date;
}

const mockBidHistory: BidHistory[] = [
  { id: 1, participant: 'ООО "СтройТех"', price: 2450000, time: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: 2, participant: 'ИП Петров А.С.', price: 2500000, time: new Date(Date.now() - 4 * 60 * 60 * 1000) },
  { id: 3, participant: 'ООО "ТехСнаб"', price: 2600000, time: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  { id: 4, participant: 'ООО "ПромКомплект"', price: 2700000, time: new Date(Date.now() - 10 * 60 * 60 * 1000) },
  { id: 5, participant: 'ООО "МегаСнаб"', price: 2850000, time: new Date(Date.now() - 15 * 60 * 60 * 1000) },
];

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  
  const auction = mockAuctions.find(a => a.id === Number(id)) || mockAuctions[0];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeRemaining = (endTime: Date) => {
    const diff = endTime.getTime() - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} дн. ${hours} ч. ${minutes} мин.`;
    if (hours > 0) return `${hours} ч. ${minutes} мин.`;
    return `${minutes} мин.`;
  };

  const handlePlaceBid = () => {
    const amount = Number(bidAmount);
    if (!amount || amount >= auction.currentPrice) {
      toast({
        title: 'Ошибка',
        description: 'Ставка должна быть меньше текущей цены и соответствовать шагу аукциона',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Ставка принята!',
      description: `Ваша ставка ${formatPrice(amount)} успешно размещена`,
    });
    
    setBidAmount('');
  };

  const suggestedBid = auction.currentPrice - auction.minStep;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-2">
                <Icon name="ArrowLeft" size={18} />
                Назад
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <Icon name="Gavel" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">ЭТП Гарант</h1>
                  <p className="text-xs text-muted-foreground">Электронная торговая площадка</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="gap-2">
              <Icon name="User" size={18} />
              Войти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="text-5xl">{auction.image}</div>
                  <Badge variant={auction.status === 'ending' ? 'destructive' : 'default'} className="text-sm">
                    {auction.status === 'ending' ? 'Завершается' : 'Активен'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Лот № {auction.lotNumber}</p>
                  <CardTitle className="text-2xl">{auction.title}</CardTitle>
                  <CardDescription className="text-base">{auction.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Организатор</p>
                    <p className="font-medium">{auction.organizerName}</p>
                    <p className="text-sm text-muted-foreground">ИНН: {auction.organizerInn}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Категория</p>
                    <Badge variant="outline">{auction.category}</Badge>
                  </div>
                </div>

                <Tabs defaultValue="specs" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="specs">Спецификация</TabsTrigger>
                    <TabsTrigger value="delivery">Поставка</TabsTrigger>
                    <TabsTrigger value="payment">Оплата</TabsTrigger>
                  </TabsList>
                  <TabsContent value="specs" className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Техническое задание</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {auction.specifications}
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="delivery" className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Условия поставки</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {auction.deliveryTerms}
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="payment" className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Условия оплаты</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {auction.paymentTerms}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="History" size={20} />
                    История ставок
                  </h3>
                  <div className="space-y-2">
                    {mockBidHistory.map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="User" size={16} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{bid.participant}</p>
                            <p className="text-xs text-muted-foreground">{formatDateTime(bid.time)}</p>
                          </div>
                        </div>
                        <p className="font-bold text-primary">{formatPrice(bid.price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Информация о торге</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Текущая цена</p>
                    <p className="text-3xl font-bold text-primary">{formatPrice(auction.currentPrice)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Начальная</p>
                      <p className="font-semibold">{formatPrice(auction.startPrice)}</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Экономия</p>
                      <p className="font-semibold text-green-600">
                        {Math.round((1 - auction.currentPrice / auction.startPrice) * 100)}%
                      </p>
                    </div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Шаг аукциона</p>
                    <p className="font-semibold">{formatPrice(auction.minStep)}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Clock" size={18} />
                    <div>
                      <p className="text-xs">Осталось времени</p>
                      <p className="font-semibold text-foreground">{getTimeRemaining(auction.endTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Calendar" size={18} />
                    <div>
                      <p className="text-xs">Окончание торгов</p>
                      <p className="font-semibold text-foreground">{formatDateTime(auction.endTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon name="Users" size={18} />
                    <div>
                      <p className="text-xs">Количество ставок</p>
                      <p className="font-semibold text-foreground">{auction.bidsCount}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold">Сделать ставку</h4>
                  <div className="space-y-2">
                    <Label htmlFor="bid">Ваша цена (₽)</Label>
                    <Input
                      id="bid"
                      type="number"
                      placeholder={suggestedBid.toString()}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Рекомендуемая ставка: {formatPrice(suggestedBid)}
                    </p>
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    size="lg"
                    onClick={handlePlaceBid}
                  >
                    <Icon name="TrendingDown" size={20} />
                    Сделать ставку
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Для участия в торгах необходима авторизация
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Icon name="Star" size={18} />
                    В избранное
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Icon name="Download" size={18} />
                    Документы
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuctionDetail;
