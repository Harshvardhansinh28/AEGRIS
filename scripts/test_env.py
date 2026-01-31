from trading_env import TradingEnv

env = TradingEnv()
obs, _ = env.reset()

print("Observation shape:", obs.shape)

for step in range(5):
    action = env.action_space.sample()
    obs, reward, done, _, info = env.step(action)
    env.render()

print("Environment test completed successfully.")

