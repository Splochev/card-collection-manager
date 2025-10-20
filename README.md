# Card Collection Manager - Kafka Microservices Documentation

## 📋 Table of Contents
- [What is Kafka?](#what-is-kafka)
- [Why Use Kafka?](#why-use-kafka)
- [Kafka Architecture](#kafka-architecture)
- [Your Current Setup](#your-current-setup)
- [Using Kafka UI Dashboard](#using-kafka-ui-dashboard)
- [NestJS Integration](#nestjs-integration)
- [Creating Your First Topic](#creating-your-first-topic)
- [Producers & Consumers](#producers--consumers)
- [Use Cases for Card Collection](#use-cases-for-card-collection)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🤔 What is Kafka?

**Apache Kafka** is a distributed event streaming platform that lets you:

- **📨 Publish and subscribe** to streams of records (messages)
- **💾 Store** streams of records in a fault-tolerant way
- **⚡ Process** streams of records in real-time

Think of it as a **high-performance message queue** that can handle millions of messages per second, with built-in durability and scalability.

### Key Benefits:
- **🚀 High Throughput** - Millions of messages/second
- **💪 Fault Tolerant** - Messages survive server crashes
- **📈 Scalable** - Add more servers as you grow
- **🔄 Real-time** - Process data as it arrives
- **🏗️ Decoupled** - Services communicate without direct dependencies

---

## 🎯 Why Use Kafka?

### Traditional Approach (Problems):
```javascript
// Service A calls Service B directly
const result = await http.post('http://service-b/api/cards', cardData);
// ❌ If Service B is down, Service A fails
// ❌ Tight coupling between services
// ❌ No retry mechanism
// ❌ Hard to scale
```

### Kafka Approach (Solutions):
```javascript
// Service A publishes event
await kafka.produce('card-created', cardData);

// Service B consumes event (when ready)
kafka.consume('card-created', async (cardData) => {
  // Process asynchronously
});
// ✅ Services are decoupled
// ✅ Messages are durable (survive crashes)
// ✅ Easy horizontal scaling
// ✅ Built-in retry and error handling
```

---

## 🏗️ Kafka Architecture

### Core Components:

#### 1. **📋 Topics**
- Like "folders" or "channels" for messages
- Example: `user-registrations`, `card-updates`, `price-changes`

#### 2. **📦 Partitions**
- Topics are split into partitions for parallel processing
- Each partition is ordered, but partitions are independent
- Allows horizontal scaling

#### 3. **📤 Producers**
- Applications that send messages to topics
- Can choose which partition to send to (or let Kafka decide)

#### 4. **📥 Consumers**
- Applications that read messages from topics
- Can read from specific partitions or let Kafka balance load

#### 5. **👥 Consumer Groups**
- Multiple consumers can share the workload
- Each message goes to only one consumer in the group
- Perfect for load balancing

#### 6. **🦁 Zookeeper**
- Manages cluster coordination
- Tracks broker health and metadata
- Handles leader election

---

## 🚀 Your Current Setup

Your `docker-compose.yml` includes:

```yaml
# Zookeeper (cluster coordinator)
zookeeper:
  image: confluentinc/cp-zookeeper:7.4.0
  ports:
    - "2181:2181"

# Kafka Broker (message broker)
kafka:
  image: confluentinc/cp-kafka:7.4.0
  ports:
    - "9092:9092"
  depends_on:
    - zookeeper

# Kafka UI Dashboard (web interface)
kafka-ui:
  image: provectuslabs/kafka-ui:latest
  ports:
    - "8081:8080"
  depends_on:
    - kafka
```

### Access Points:
- **Kafka UI Dashboard**: http://localhost:8081
- **Kafka Broker**: localhost:9092
- **Zookeeper**: localhost:2181

---

## 📊 Using Kafka UI Dashboard

### Getting Started:
1. **Start services**: `docker-compose up -d`
2. **Open dashboard**: http://localhost:8081
3. **You'll see your "local" cluster**

### Dashboard Features:

#### 📋 Topics Tab
- View all topics
- Create new topics
- Delete topics
- See partition count and replication

#### 📊 Brokers Tab
- Monitor Kafka broker health
- See active connections
- View broker configuration

#### 👥 Consumer Groups Tab
- Track consumer group progress
- See lag (how many messages behind)
- Monitor consumer health

#### 🔍 Messages Tab
- Browse messages in real-time
- Filter by topic/partition
- View message content and metadata

---

## 🏗️ NestJS Integration

### 1. Install Dependencies

```bash
npm install @nestjs/microservices kafkajs
```

### 2. Create Kafka Module

```typescript
// src/modules/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'card-collection-consumer',
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class KafkaModule {}
```

### 3. Import in App Module

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
})
export class AppModule {}
```

---

## 🎯 Creating Your First Topic

### Via Kafka UI:
1. Go to http://localhost:8081
2. Click "Topics" tab
3. Click "Add a Topic"
4. Enter topic name: `card-created`
5. Set partitions: `3` (for parallel processing)
6. Set replication factor: `1` (single broker setup)

### Via Command Line:
```bash
# Create topic
docker exec -it card-collection-kafka kafka-topics --create \
  --topic card-created \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1

# List topics
docker exec -it card-collection-kafka kafka-topics --list \
  --bootstrap-server localhost:9092
```

---

## 📤 Producers & Consumers

### Creating a Producer Service

```typescript
// src/modules/cards/card-producer.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class CardProducerService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Connect to Kafka
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    // Close connection
    await this.kafkaClient.close();
  }

  async publishCardCreated(card: any) {
    // Send message to topic
    await this.kafkaClient.emit('card-created', {
      cardId: card.id,
      cardName: card.name,
      userId: card.userId,
      timestamp: new Date(),
    });
  }

  async publishCardUpdated(cardId: string, updates: any) {
    await this.kafkaClient.emit('card-updated', {
      cardId,
      updates,
      timestamp: new Date(),
    });
  }
}
```

### Creating a Consumer Service

```typescript
// src/modules/notifications/card-consumer.service.ts
import { Injectable } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class CardConsumerService {
  @MessagePattern('card-created')
  async handleCardCreated(@Payload() data: any) {
    console.log('🎉 New card created:', data);

    // Send notification, update cache, etc.
    await this.sendNotification(data.userId, `New card added: ${data.cardName}`);
    await this.updateSearchIndex(data.cardId);
  }

  @MessagePattern('card-updated')
  async handleCardUpdated(@Payload() data: any) {
    console.log('📝 Card updated:', data);

    // Handle price changes, rarity updates, etc.
    if (data.updates.price) {
      await this.checkPriceAlerts(data.cardId, data.updates.price);
    }
  }

  private async sendNotification(userId: string, message: string) {
    // Implementation for sending notifications
  }

  private async updateSearchIndex(cardId: string) {
    // Update Elasticsearch or similar
  }

  private async checkPriceAlerts(cardId: string, newPrice: number) {
    // Check if price crossed user-defined thresholds
  }
}
```

### Using the Producer in Controllers

```typescript
// src/modules/cards/cards.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CardProducerService } from './card-producer.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly producer: CardProducerService) {}

  @Post()
  async createCard(@Body() cardData: any) {
    // Save to database first
    const card = await this.cardService.create(cardData);

    // Then publish event (fire-and-forget)
    await this.producer.publishCardCreated(card);

    return card;
  }
}
```

---

## 🎴 Use Cases for Card Collection

### 1. **Real-time Price Tracking**
```typescript
// Producer: When scraping card prices
await producer.emit('card-price-updated', {
  cardId: 'ABC-123',
  oldPrice: 5.99,
  newPrice: 12.50,
  source: 'cardmarket'
});

// Consumer: Send price alerts to users
@MessagePattern('card-price-updated')
async handlePriceUpdate(@Payload() data) {
  const subscribers = await this.getPriceAlertSubscribers(data.cardId);
  for (const user of subscribers) {
    if (data.newPrice >= user.alertPrice) {
      await this.sendPriceAlert(user, data);
    }
  }
}
```

### 2. **Collection Synchronization**
```typescript
// Producer: When user adds card to collection
await producer.emit('collection-updated', {
  userId: 'user-123',
  action: 'add',
  cardId: 'XYZ-456',
  quantity: 1
});

// Consumer: Update user's collection stats
@MessagePattern('collection-updated')
async handleCollectionUpdate(@Payload() data) {
  await this.updateCollectionStats(data.userId);
  await this.recalculateCollectionValue(data.userId);
}
```

### 3. **Search Index Updates**
```typescript
// Producer: When card data changes
await producer.emit('card-metadata-updated', {
  cardId: 'DEF-789',
  field: 'rarity',
  oldValue: 'common',
  newValue: 'rare'
});

// Consumer: Update search index
@MessagePattern('card-metadata-updated')
async handleMetadataUpdate(@Payload() data) {
  await this.elasticsearch.updateCard(data.cardId, data);
}
```

### 4. **Audit Logging**
```typescript
// Producer: Log all user actions
await producer.emit('user-action', {
  userId: 'user-123',
  action: 'card-purchased',
  cardId: 'GHI-012',
  price: 15.99,
  timestamp: new Date()
});

// Consumer: Store in audit database
@MessagePattern('user-action')
async handleUserAction(@Payload() data) {
  await this.auditService.log(data);
}
```

---

## ✅ Best Practices

### Message Design:
- **Keep messages small** (< 1MB)
- **Use consistent schemas** (consider Avro/Protobuf)
- **Include timestamps** for debugging
- **Use meaningful topic names** (kebab-case)

### Consumer Groups:
- **Use unique group IDs** for different applications
- **Multiple consumers** in same group = load balancing
- **Different groups** = multiple copies of messages

### Error Handling:
- **Implement retry logic** with exponential backoff
- **Use dead letter topics** for failed messages
- **Monitor consumer lag** in Kafka UI

### Performance:
- **Batch messages** when possible
- **Use appropriate partition counts** (3-6 per topic usually)
- **Monitor throughput** and adjust as needed

### Reliability:
- **Set retention policies** (how long to keep messages)
- **Configure replication** (at least 3 in production)
- **Use acknowledgments** for message delivery guarantees

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **Connection Refused**
```bash
# Check if Kafka is running
docker-compose ps

# Check Kafka logs
docker-compose logs kafka
```

#### 2. **Messages Not Consuming**
```bash
# Check consumer group status
docker exec -it card-collection-kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group your-group-id \
  --describe
```

#### 3. **Topic Doesn't Exist**
```bash
# Create topic manually
docker exec -it card-collection-kafka kafka-topics \
  --create --topic your-topic \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1
```

#### 4. **High Consumer Lag**
- Check consumer performance
- Increase partition count
- Add more consumer instances

### Useful Commands:

```bash
# List topics
docker exec -it card-collection-kafka kafka-topics --list --bootstrap-server localhost:9092

# Describe topic
docker exec -it card-collection-kafka kafka-topics --describe --topic your-topic --bootstrap-server localhost:9092

# Produce test message
docker exec -it card-collection-kafka kafka-console-producer --topic your-topic --bootstrap-server localhost:9092

# Consume messages
docker exec -it card-collection-kafka kafka-console-consumer --topic your-topic --from-beginning --bootstrap-server localhost:9092
```

---

## 🚀 Next Steps

1. **Create your first topic** in Kafka UI
2. **Implement a producer** in your card creation endpoint
3. **Build a consumer** for notifications or analytics
4. **Add more topics** as your app grows
5. **Monitor performance** using the dashboard

### Advanced Topics:
- **Kafka Streams** for real-time processing
- **Kafka Connect** for database integration
- **Schema Registry** for message validation
- **Multi-broker clusters** for production

---

## 📚 Additional Resources

- [Kafka Documentation](https://kafka.apache.org/documentation/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
- [Kafka UI GitHub](https://github.com/provectuslabs/kafka-ui)
- [Confluent Platform](https://docs.confluent.io/)

Happy streaming! 🎉