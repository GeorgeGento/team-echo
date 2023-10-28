# [Team Echo](https://team-echo.vercel.app/)

TeamEcho is the cutting-edge chat application that is set to transform the way teams collaborate and communicate. With a sleek and intuitive interface, TeamEcho provides a seamless experience for users across various industries and purposes.

**Project live at:** [https://team-echo.vercel.app/](https://team-echo.vercel.app/)

> **Note**
> Project currently runs on vercel which only supports serverless functions thus sockets wont function properly.
---

## Features

- Create your own server
- Create channels (text, voice, video) within your server
- Add friends
- Send messages in text channels or direct messages
- Video/Audio calls

---

## Technologies used

- [React](https://es.reactjs.org/) - Front-End JavaScript library.
- [Nextjs](https://nextjs.org/) - The React Framework for the Web.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
- [ShadCN UI](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
- [Prisma](https://www.prisma.io/) - Next-generation Node.js and TypeScript ORM.
- [Clerk](https://clerk.com/) - Integrate complete user management UIs and APIs, purpose-built for React, Next.js, and the Modern Web.
- [Zod](https://zod.dev/) - TypeScript-first schema validation with static type inference.
- [Zustand](https://github.com/pmndrs/zustand) - A small, fast and scalable bearbones state-management solution using simplified flux principles. Has a comfy API based on hooks, isn't boilerplatey or opinionated.
- [Socket.IO](https://socket.io/) - Bidirectional and low-latency communication for every platform.
- [Uploadthing](https://uploadthing.com/) - File uploads for Next.js developers.
- [Livekit](https://livekit.io/) - Real-time video, audio, and data for developers.

---

## Build steps

1. Clone this repo

```bash
git clone https://github.com/GeorgeGento/team-echo && cd team-echo
```

2. Install project dependecies

```bash
npm install
```

3. Build the project and start a local server

```bash
npx prisma generate && npm run build && npm run serve
```
