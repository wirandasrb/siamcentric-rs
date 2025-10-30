# ==========================
# Stage 1: Build stage
# ==========================
FROM node:18-alpine AS builder

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json (หรือ yarn.lock ถ้ามี)
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm ci

# คัดลอก source code ทั้งหมดเข้า container
COPY . .

# สร้าง build ด้วย Turbopack
RUN npm run build

# ==========================
# Stage 2: Production stage
# ==========================
FROM node:18-alpine AS runner

WORKDIR /app

# ตั้งค่า environment
ENV NODE_ENV=production

# คัดลอกไฟล์สำคัญจาก builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# เปิดพอร์ต (ค่า default ของ Next.js)
EXPOSE 3000

# คำสั่งเริ่มรัน
CMD ["npm", "start"]
