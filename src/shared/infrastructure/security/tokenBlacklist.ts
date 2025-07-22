const blacklist = new Set<string>();

export const tokenBlacklist = {
  add(token: string) {
    blacklist.add(token);
  },
  has(token: string) {
    return blacklist.has(token);
  },
  clear() {
    blacklist.clear();
  },
};
