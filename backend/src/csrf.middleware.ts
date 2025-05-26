import csurf from 'csurf';
import { NextFunction, Request, Response } from 'express';

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none',
    secure: process.env.NODE_ENV === 'production',
    domain: process.env.NODE_ENV === 'production' ? '.ya-budu.ru' : undefined,
  },
});

export function csrfExclude(excludedPaths: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    if (excludedPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    return csrfProtection(req, res, next);
  };
}
